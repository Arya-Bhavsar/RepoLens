import Header from "./Header.jsx";
import RepoSelector from "./RepoSelector.jsx";
import FileTree from "./FileTree.jsx";
import { useEffect, useState } from "react";
import CodeViewer from "./CodeViewer.jsx";
import api from "../axios";
import ChatWindow from "./ChatWindow.jsx";

export default function Dashboard() {
    // List of {full_name, default_branch} of the repositories added by the user
    const [currentOwner, setCurrentOwner] = useState('');
    const [currentRepo, setCurrentRepo] = useState('');
    const [currentFile, setCurrentFile] = useState('');
    const [currentDefaultBranch, setCurrentDefaultBranch] = useState('');
    const [currentBranch, setCurrentBranch] = useState('');

    // Function to pass currentOwner and currentRepo to FileTree component
    const updateCurrentRepo = (owner, repo, defaultBranch) => {
        setCurrentOwner(owner);
        setCurrentRepo(repo);
        setCurrentDefaultBranch(defaultBranch);
        setCurrentFile("");
        setCurrentBranch("");
    };

    const updateCurrentFile = (file) => {
        console.log("Selected file:", file);
        setCurrentFile(file);
    };

    const updateCurrentBranch = (branch) => {
        console.log("Current branch:", branch)
        setCurrentBranch(branch);
    }

    return (
        <div className="h-screen max-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <Header />
            <div className="flex flex-row flex-1 gap-4 overflow-hidden">
                <div className="flex flex-col flex-1 pl-4 py-4 gap-4 overflow-hidden">
                    <RepoSelector updateCurrentRepo={updateCurrentRepo} />
                    <div className="flex flex-row flex-1 gap-4 overflow-hidden">
                        <FileTree
                            owner={currentOwner}
                            repo={currentRepo}
                            defaultBranch={currentDefaultBranch}
                            updateCurrentFile={updateCurrentFile}
                            updateCurrentBranch={updateCurrentBranch}
                        />
                        <CodeViewer
                            owner={currentOwner}
                            repo={currentRepo}
                            branch={currentBranch}
                            file={currentFile}
                        />
                    </div>
                </div>

                {/* Chat Window */}
                <ChatWindow />
            </div>
        </div>
    )
}