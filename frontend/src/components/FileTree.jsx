import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { Separator, Select, ListBox, Label } from "@heroui/react";
import { useEffect, useState } from "react";
import api from "../axios.js";
import FileNode from "./FileNode.jsx";
import buildTree from "../fileTreeUtils.js";

export default function FileTree(props) {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [fileTree, setFileTree] = useState(null);

    const updateSelectedFile = (selectedFile) => {
        props.updateCurrentFile(selectedFile);
        props.updateCurrentBranch(selectedBranch);
    };

    // Fetch the branches of the current repository whenever the owner or repo changes
    useEffect(() => {
        const fetchBranches = async () => {
            if (!props.owner || !props.repo) {
                setBranches([]);
                setSelectedBranch('');
                return;
            }

            // Fetch the file tree for the current repository and branch from the backend
            try {
                const res = await api.get('/repo/branches', {
                    params: { owner: props.owner, repo: props.repo }
                });
                setBranches(res.data);
                setSelectedBranch(props.defaultBranch);
            } catch (err) {
                console.error('Error fetching repository branches:', err);
            }
        }

        fetchBranches();
    }, [props.owner, props.repo, props.defaultBranch]);

    // Fetch the file tree for the current repository and branch whenever the selected branch changes
    useEffect(() => {
        const fetchFileTree = async () => {
            if (!props.owner || !props.repo || !selectedBranch) return;

            try {
                const res = await api.get('/repo/tree', {
                    params: { owner: props.owner, repo: props.repo, branch: selectedBranch }
                });
                const files = res.data;
                // Convert the flat list of files and directories into a nested structure
                const tree = buildTree(files);
                setFileTree(tree);

            } catch (err) {
                console.error('Error fetching repository tree:', err);
            }
        };

        fetchFileTree();
    }, [selectedBranch, props.owner, props.repo]);

    return (
        <div className="flex flex-col w-[256px] h-full rounded-lg py-4 bg-gray-100 dark:bg-zinc-900 overflow-hidden">
            <header className="flex flex-col px-4 w-full gap-2">
                {/* Title */}
                <div className="flex flex-row items-center gap-2">
                    <DocumentDuplicateIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold">Files</h2>
                </div>

                {/* Branch Selector */}
                <Select
                    variant="secondary"
                    className="w-full"
                    placeholder="Branch"
                    value={selectedBranch}
                    onChange={(value) => {
                        setSelectedBranch(value);
                        api.post("/repo/embeddings", {
                            owner: props.owner,
                            repo: props.repo,
                            branch: value
                        }).catch(console.error);
                    }}
                >
                    <Label /> {/* To avoid warnings in the console */}
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
    
                    <Select.Popover className="dark:bg-zinc-800!">
                        <ListBox items={branches.map(branch => ({ id: branch, name: branch }))}>
                            {(item) => (
                                <ListBox.Item id={item.id} textValue={item.name}>
                                    {item.name}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            )}
                        </ListBox>
                    </Select.Popover>
                </Select>

                {/* Search for the files - LATER */}
            </header>

            <Separator className="my-4 bg-gray-300 dark:bg-zinc-700" />

            {/* File Tree */}
            <div className="flex flex-col grow overflow-y-auto min-h-0">
                {fileTree && fileTree.map((node, index) => (
                    <FileNode
                        key={`${node.sha}-${index}`} 
                        node={node}
                        updateSelectedFile={updateSelectedFile}
                    />
                ))}
            </div>
        </div>
    )
}