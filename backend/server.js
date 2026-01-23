import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});