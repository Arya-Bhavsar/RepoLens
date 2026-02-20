import { Octokit } from "@octokit/rest";
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Initialize Octokit with authentication
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export default octokit;