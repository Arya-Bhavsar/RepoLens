import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { Separator, Select, ListBox, Label } from "@heroui/react";
import { useEffect, useState } from "react";
import api from "../axios.js";

export default function FileTree(props) {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    // Fetch the branches of the current repository whenever the owner or repo changes
    useEffect(() => {
        const fetchBranches = async () => {
            if (!props.owner || !props.repo) return;

            // Fetch the file tree for the current repository and branch from the backend
            try {
                console.log('Fetching branches for', props.owner, props.repo);
                const res = await api.get('/repo/branches', {
                    params: { owner: props.owner, repo: props.repo }
                });
                console.log('Branches:', res.data);
                setBranches(res.data);
            } catch (err) {
                console.error('Error fetching repository branches:', err);
            }
        }

        fetchBranches();
    }, [props.owner, props.repo]);

    return (
        <div className="w-72 min-h-screen rounded-lg p-4 bg-gray-100 dark:bg-zinc-900">
            <header className="flex flex-col w-full gap-2">
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
                    }}
                >
                    <Label /> {/* To avoid warnings in the console */}
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
    
                    <Select.Popover className="dark:bg-zinc-800!">
                        <ListBox>
                            {branches.map((branch, index) => (
                                <ListBox.Item key={index} id={index.toString()} textValue={branch}>
                                    {branch}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                {/* Search for the files - LATER */}
            </header>

            <Separator className="my-4 bg-gray-300 dark:bg-zinc-700" />

            {/* File Tree */}
            <div>

            </div>
        </div>
    )
}