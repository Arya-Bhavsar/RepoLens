import Header from "./Header.jsx";
import RepoSelector from "./RepoSelector.jsx";
import FileTree from "./FileTree.jsx";
import { useState } from "react";

export default function Dashboard() {
    // List of {full_name, default_branch} of the repositories added by the user
    const [currentOwner, setCurrentOwner] = useState('');
    const [currentRepo, setCurrentRepo] = useState('');

    // Function to pass currentOwner and currentRepo to FileTree component
    const updateCurrentRepo = (owner, repo) => {
        setCurrentOwner(owner);
        setCurrentRepo(repo);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <Header />
            <div className="flex flex-col min-h-screen px-8 py-4 gap-8">
                <RepoSelector updateCurrentRepo={updateCurrentRepo} />
                <div className="flex flex-row">
                    <FileTree owner={currentOwner} repo={currentRepo} />
                </div>
            </div>
        </div>
    )
}