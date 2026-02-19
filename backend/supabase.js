import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);