import Header from "./Header.jsx";
import RepoSelector from "./RepoSelector.jsx";
import FileTree from "./FileTree.jsx";
import { useState } from "react";
import CodeViewer from "./CodeViewer.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { Panel, Group, Separator } from "react-resizable-panels";

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

    const updateCurrentFile = (file) => setCurrentFile(file);

    const updateCurrentBranch = (branch) => setCurrentBranch(branch);

    return (
        <div className="h-screen max-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <Header />
            <Group direction="horizontal" className="flex-1 overflow-hidden">
                <Panel className="pr-3">
                    <div className="flex flex-col h-full pl-4 py-4 gap-4 overflow-hidden">
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
                </Panel>

                <Separator className="w-1 hover:bg-blue-500 transition-colors" />

                {/* Chat Window */}
                <Panel defaultSize="512px" minSize="25%" maxSize="50%">
                    <ChatWindow repo={currentRepo} />
                </Panel>
            </Group>
        </div>
    )
}