import { useEffect } from "react"
import { supabase } from "../supabase.js";

export default function Dashboard() {
    
    // Call the protected API route to verify authentication -- REMOVE THIS LATER
    useEffect(() => {
        const fetchProtectedData = async () => {
            const {data, error} = await supabase.auth.getSession();
            if (error || !data.session) {
                console.error('User is not authenticated');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/protected', {
                    headers: { Authorization: `Bearer ${data.session.access_token}` }
                });
                const result = await response.json();
                console.log('Protected data:', result);
            } catch (err) {
                console.error('Error fetching protected data:', err);
            }
        };

        fetchProtectedData();
    }, []);

    return (
        <div></div>
    )
}