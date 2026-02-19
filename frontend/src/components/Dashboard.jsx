import { useEffect } from "react"
import { supabase } from "../supabase.js";
import Header from "./Header.jsx";

export default function Dashboard() {
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
            <Header />
        </div>
    )
}