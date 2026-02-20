import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from './auth.js';
import { supabase } from './supabase.js';
import octokit from './octokit.js';

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());

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

// Route to fetch repository data (with default branch) from GitHub
app.get('/repo', requireAuth, async (req, res) => {
    const { owner , repo } = req.query;
    try {
        const { data } = await octokit.repos.get({ owner, repo });
        res.json({
            name: data.name,
            description: data.description,
            default_branch: data.default_branch
        })
    } catch (err) {
        console.error('Error fetching repository data:', err);
        res.status(500).json({ error: 'Failed to fetch repository data' });
    }
});

// Route to get all the branches of a repository from GitHub
app.get('repo/branches', requireAuth, async (req, res) => {
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
        const [ data ] = await octokit.repos.getContent({
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