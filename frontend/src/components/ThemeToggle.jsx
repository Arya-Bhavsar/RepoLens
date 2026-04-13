import { useTheme } from "../ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
    const {darkMode, toggleTheme } = useTheme();

    return (
        <div onClick={toggleTheme} className="flex items-center cursor-pointer w-full">
            {darkMode ? (
                <MoonIcon className="w-4 h-4 shrink-0 text-gray-400" />
            ) : (
                <SunIcon className="w-4 h-4 shrink-0 text-gray-400" />
            )}
            <span className="ml-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 flex-1">
                {darkMode ? "Dark mode" : "Light mode"}
            </span>
            <div className={`w-9 h-5 flex items-center rounded-full p-0.5 duration-300 ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${darkMode ? "translate-x-4" : "translate-x-0"}`} />
            </div>
    </div>
    );
}