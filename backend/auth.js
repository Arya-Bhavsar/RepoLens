import { supabase } from "./supabase.js";

// Middleware to protect routes
export const requireAuth = async (req, res, next) => {
    // Check for the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token and get the user
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Attach the user to the request object for use in subsequent handlers
    req.user = data.user;
    next();
};