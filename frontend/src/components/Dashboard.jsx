import Header from "./Header.jsx";
import RepoSelector from "./RepoSelector.jsx";

export default function Dashboard() {
    
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <Header />
            <div className="px-8 py-4">
                <RepoSelector />
            </div>
        </div>
    )
}