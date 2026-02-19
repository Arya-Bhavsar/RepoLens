import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from './auth.js';

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());

// Protected route example
app.get("/api/protected", requireAuth, (req, res) => {
    res.json({
        message: 'You are authenticated',
        userId: req.user.id,
        email: req.user.email
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});