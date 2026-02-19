import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase.js';

export default function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a new auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) return console.error('Error signing up:', authError.message);
        
        const userId = authData.user.id;

        // Insert user data into the 'profiles' table
        const { error: profileError } = await supabase.from('profiles').insert({
            id: userId,
            email,
            first_name: firstName,
            last_name: lastName
        })

        if (profileError) return console.error('Error creating profile:', profileError.message);
        
        console.log('User signed up successfully!');

        // Redirect to the login after successful signup
        navigate('/login');
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-zinc-900">
            <div className="bg-white dark:bg-zinc-800 p-12 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-12">Sign Up</div>
                <form onSubmit={handleSubmit} className="space-y-7">
                    <input 
                        type="text" 
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="text" 
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="mt-4 cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200">Sign Up</button>
                </form>
                <p className="text-zinc-400 mt-2">Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 dark:text-blue-500 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    )
}