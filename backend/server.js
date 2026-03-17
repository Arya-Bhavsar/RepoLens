import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from './auth.js';
import { supabase } from './supabase.js';
import { Octokit } from "@octokit/rest";
import { CohereClientV2 } from 'cohere-ai';

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json())

// Initialize Octokit client with authentication
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

// Initialize Cohere client
const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY,
});

// Route to get user profile
app.get('/me', requireAuth, async (req, res) => {
    try {
        // Fetch the user's profile from the 'profiles' table
        const { data, error } = await supabase
            .from('profiles')
            .select("first_name, last_name")
            .eq('id', req.user.id)
            .single();

        if (error) return res.status(500).json({ error: error.message });

        // Return the user's profile information
        res.json({
            id: req.user.id,
            email: req.user.email,
            first_name: data.first_name,
            last_name: data.last_name
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Route to get repositories from Supabase
app.get('/repositories', requireAuth, async (req, res) => {
    const { data, error } = await supabase
        .from("repositories")
        .select("owner, name, default_branch")
        .eq("user_id", req.user.id);
    
    if (error) return res.status(500).json({ error: error.message })

    res.json(data.map(repo => ({
        full_name: `${repo.owner}/${repo.name}`,
        default_branch: repo.default_branch
    })));
});

// Route to add repository from GitHub
app.post('/repositories', requireAuth, async (req, res) => {
    const { owner , repo } = req.body;
    try {
        // Get the repo from GitHub
        const { data } = await octokit.repos.get({ owner, repo });
        
        // Add the repo to Supabase
        const { data: insertedRepo, error } = await supabase
            .from("repositories")
            .insert({
                owner: owner,
                name: repo,
                default_branch: data.default_branch,
                user_id: req.user.id
            })
            .select('id')
            .single();

        if (error) {
            console.log("Error adding reposiroty to Supabase:", error);
            return res.status(500).json({ error: 'Failed to add repository data' });
        }

        const { data: branchData } = await octokit.repos.getBranch({ owner, repo, branch: data.default_branch })
        
        // Return the repo full name and default branch
        res.json({
            full_name: data.full_name,
            default_branch: data.default_branch
        })

        // Generate and store embeddings in the background
        generateEmbeddings(insertedRepo.id, owner, repo, data.default_branch, branchData.commit.sha).catch(console.error);
    } catch (err) {
        console.error('Error fetching repository data:', err);
        return res.status(500).json({ error: 'Failed to fetch repository data' });
    }
});

// Route to delete a repository
app.delete("/repositories", requireAuth, async (req, res) => {
    const { owner, name } = req.query;
    
    const response = await supabase
        .from("repositories")
        .delete()
        .eq("owner", owner)
        .eq("name", name)
        .eq("user_id", req.user.id)
    
    res.json(response);
});

// Route to get all the branches of a repository from GitHub
app.get('/repo/branches', requireAuth, async (req, res) => {
    const { owner , repo } = req.query;
    try {
        const { data } = await octokit.repos.listBranches({ owner, repo });
        res.json(data.map(branch => branch.name));
    } catch (err) {
        console.error('Error fetching repository branches:', err);
        res.status(500).json({ error: 'Failed to fetch repository branches' });
    }
});

// Route to get the file tree given a branch name from GitHub
app.get('/repo/tree', requireAuth, async (req, res) => {
    const { owner , repo, branch } = req.query;
    try {
        const { data } = await octokit.git.getTree({
            owner,
            repo,
            tree_sha: branch,
            recursive: true
        });
        res.json(data.tree);
    } catch (err) {
        console.error('Error fetching repository tree:', err);
        res.status(500).json({ error: 'Failed to fetch repository tree' });
    }
});

// Route to get the content of a file from GitHub
app.get('/repo/file', requireAuth, async (req, res) => {
    const { owner, repo, path, branch } = req.query;
    try {
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path,
            ref: branch
        })
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        res.json({ content })
    } catch (err) {
        console.error('Error fetching file content:', err);
        res.status(500).json({ error: 'Failed to fetch file content' });
    }
});

// Files/directories to skip for embeddings
const SKIP_PATTERNS = [
    // Dependencies
    'node_modules/', 'vendor/', '.venv/', 'venv/', '__pycache__/',
    // Lock files
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'composer.lock', 'Gemfile.lock',
    // Build outputs
    'dist/', 'build/', 'out/', '.next/', '.nuxt/', 'coverage/',
    // Git
    '.git/',
    // Minified/generated
    '.min.js', '.min.css', '.bundle.js', '.chunk.js', '.map',
    // Images
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.bmp', '.tiff',
    // Fonts
    '.ttf', '.woff', '.woff2', '.eot', '.otf',
    // Media
    '.mp4', '.mp3', '.wav', '.ogg', '.avi', '.mov',
    // Archives
    '.zip', '.tar', '.gz', '.rar', '.7z',
    // Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    // Binary/compiled
    '.exe', '.dll', '.so', '.dylib', '.class', '.pyc',
    // Data files
    '.csv', '.sqlite', '.db',
    // Logs
    '.log',
    // Environment
    '.env', '.env.local', '.env.production',
];

// Helper function to determine if a file should be skipped for embedding
const shouldSkipFile = (path) => {
    return SKIP_PATTERNS.some(pattern => path.includes(pattern));
};

// Helper function to get chunks
const chunkText = (text, chunkSize = 500, overlap = 50) => {
    const words = text.split(/\s+/);
    const chunks = []
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
        if (i + chunkSize >= words.length) break;
    }
    return chunks;
};

// Helper function to generate embeddings
const generateEmbeddings = async (repoId, owner, repo, branch, sha) => {
    try {
        // Delete old chunks for the branch. At this point re-embedding is needed because of updated SHA
        await supabase.from('repo_chunks').delete().eq('repo_id', repoId).eq('branch', branch);

        // Fetch the file tree of the current repo
        const { data: fileTree } = await octokit.git.getTree({ owner, repo, tree_sha: branch, recursive: true });
        const files = fileTree.tree.filter(f => f.type === "blob" && !shouldSkipFile(f.path))

        // Get chunks of the files
        const allChunks = []
        for (const file of files) {
            try {
                const { data: fileData } = await octokit.repos.getContent({ owner, repo, path: file.path, ref: branch });
                const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                const chunks = chunkText(content);
                for (const chunk of chunks) {
                    allChunks.push({ file_path: file.path, chunk });
                }
            } catch (err) {
                console.error(`Skipping ${file.path}:`, err.message);
            }

            if (allChunks.length >= 500) break;
        }

        // Batch embed in groups of 96
        const BATCH_SIZE = 96;
        for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
            const batch = allChunks.slice(i, i + BATCH_SIZE);

            const response = await cohere.embed({
                model: 'embed-v4.0',
                texts: batch.map(c => c.chunk),
                inputType: 'search_document',
                embeddingTypes: ['float']
            });

            const embeddings = response.embeddings.float;

            // Insert into Supabase repo_chunks table
            const rows = batch.map((c, j) => ({
                repo_id: repoId,
                branch,
                file_path: c.file_path,
                chunk: c.chunk,
                embedding: embeddings[j]
            }));

            const { error } = await supabase.from('repo_chunks').insert(rows);
            if (error) console.error("Error inserting chunks:", error.message);
        }

        // Update repo status to ready
        await supabase.from('repositories').update({ status: 'ready' }).eq('id', repoId);

        // Update or insert the branch into the branches table
        await supabase.from('branches').upsert({ repo_id: repoId, name: branch, last_commit_sha: sha }, { onConflict: 'repo_id,name' });
    } catch (err) {
        console.error("Error generating embeddings:", err);
        await supabase.from('repositories').update({ status: 'error' }).eq('id', repoId);
    }
};

// Route to check branch SHA and update embeddings
app.post('/repo/embeddings', requireAuth, async (req, res) => {
    const { owner, repo, branch } = req.body;

    const { data: repoData } = await supabase
        .from('repositories')
        .select('id')
        .eq('owner', owner)
        .eq('name', repo)
        .single();

    // Get the latest commit sha for the branch
    const { data: branchData } = await octokit.repos.getBranch({ owner, repo, branch });
    const latestSha = branchData.commit.sha;
    
    const { data: branchRecord } = await supabase
        .from('branches')
        .select('last_commit_sha')
        .eq('repo_id', repoData.id)
        .eq('name', branch)
        .single();
    
    if (branchRecord?.last_commit_sha === latestSha) {
        return res.json({ status: 'up_to_date' });
    }

    res.json({ status: 'pending' });
    generateEmbeddings(repoData.id, owner, repo, branch, latestSha).catch(console.error);
});

// Route to summarize the repository
app.get('/repo/summarize', requireAuth, async (req, res) => {
    const { owner, repo, branch } = req.query;

    const { data, error } = await supabase
        .from('repositories')
        .select('id, status')
        .eq('owner', owner)
        .eq('name', repo)
        .single()

    if (error) return res.status(500).json({ error: 'Repository not found' });

    // Don't analyze if the status is not ready (i.e. embeddings not generated)
    if (data.status !== 'ready') return res.json({ status: data.status });

    // Run similarity search with this prompt when user clicks the "Analyze" button
    const analyzePrompt = `What is the purpose of this repository?
        What is the tech stack, architecture, and project structure?
        Give an overview of the project.`;
    
    // Get embedding for the prompt
    const embedResponse = await cohere.embed({
        model: 'embed-v4.0',
        texts: [analyzePrompt],
        inputType: 'search_query',
        embeddingTypes: ['float']
    })
    const embedding = embedResponse.embeddings.float[0];

    // Run similarity search
    const { data: chunks } = await supabase.rpc('match_chunks', {
        query_embedding: embedding,
        match_repo_id: data.id,
        match_branch: branch,
        match_threshold: 0.1,
        match_count: 25
    })

    console.log(chunks.map(c => c.file_path));

    // Call cohere chat with chunks as documents
    const response = await cohere.chat({
        model: 'command-a-03-2025',
        messages: [
            {
                role: 'system',
                content: `You are a helpful assistant that helps developers understand codebases.
                    Provide a concise summary of ${owner}/${repo} covering its purpose, tech stack, and structure.`
            },
            {
                role: 'user',
                content: analyzePrompt
            }
        ],
        documents: chunks.map(c => ({
            data: {
                title: c.file_path,
                snippet: c.chunk
            }
        }))
    });

    // Update repo status and return LLM summary
    res.json({
        status: 'ready',
        summary: response.message.content[0].text
    })
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});