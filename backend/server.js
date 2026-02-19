import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from './auth.js';
import { supabase } from './supabase.js';
import e from 'express';

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());

// Protected route to get user profile
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
    } catch(err) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});