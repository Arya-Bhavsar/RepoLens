import UserProfilePopover from "./UserProfilePopover.jsx";

export default function Header() {
    return (
        <header className="flex justify-between items-center px-6 py-2 bg-gray-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            {/* Left corner: Logo and App Name */}
            <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">Repo</span>
                <span className="text-2xl font-bold text-blue-500">Lens</span>  
            </div>

            {/* User Profile Popover */}
            <div className="flex items-center gap-2">
                <UserProfilePopover />
            </div>
        </header>
    )
}