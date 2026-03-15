import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from './auth.js';
import { supabase } from './supabase.js';
import octokit from './octokit.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json())

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
        const { error } = await supabase
            .from("repositories")
            .insert({
                owner: owner,
                name: repo,
                default_branch: data.default_branch,
                user_id: req.user.id
            });

        if (error) {
            console.log("Error adding reposiroty to Supabase:", error);
            return res.status(500).json({ error: 'Failed to add repository data' });
        }
        
        // Return the repo full name and default branch
        res.json({
            full_name: data.full_name,
            default_branch: data.default_branch
        })
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});