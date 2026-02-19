import ThemeToggle from "./ThemeToggle";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";
import { UserContext } from "../App.jsx";
import logo from "../assets/colored-logo.svg";

export default function Header() {
    const { currentUser } = useContext(UserContext);

    return (
        <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            {/* Left corner: Logo and App Name */}
            <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">Repo</span>
                <span className="text-2xl font-bold text-blue-500">Lens</span>  
            </div>

            {/* Right corner: Theme Toggle and Profile Info */}
            <div className="flex items-center gap-4">
                <ThemeToggle />

                {/* User Profile */}
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <UserCircleIcon className="w-8 h-8"/>
                    <span>{currentUser.first_name} {currentUser.last_name}</span>
                </div>
            </div>
        </header>
    )
}