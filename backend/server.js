import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});