import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());

// Test route to verify api calls are running
app.get("/api", (req, res) => {
    res.json({ status: "API fetching is working!" });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});