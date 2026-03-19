import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
    const {darkMode, toggleTheme } = useTheme();

    // Render the toggle switch
    return (
        <div onClick={toggleTheme} className="flex cursor-pointer">
            {/* NOTE: Used backtick for className not single quotes to allow JS template literal and string interpolation */}
            <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}></div>
            </div>
            <span className="ml-3 text-gray-800 dark:text-gray-100">
                {darkMode ? "Dark" : "Light"}
            </span>
        </div>
    );
}