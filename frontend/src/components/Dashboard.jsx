import Header from "./Header.jsx";
import RepoSelector from "./RepoSelector.jsx";

export default function Dashboard() {
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
            <Header />
            <div className="p-4">
                <RepoSelector />
            </div>
        </div>
    )
}