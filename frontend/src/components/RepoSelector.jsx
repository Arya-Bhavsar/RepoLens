"use client";

import { useEffect, useState } from 'react';
import { Select, ListBox, Modal, Button, Input, Label } from '@heroui/react';
import api from '../axios.js';

export default function RepoSelector(props) {
    const [url, setUrl] = useState('');
    const [repos, setRepos] = useState([]); // List of {full_name, default_branch}
    const [selectedRepo, setSelectedRepo] = useState(''); // Full name (owner/name)

    // Gets all the saved repositories from Supabase on mount
    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await api.get("/repositories");
                setRepos(res.data);
            } catch (err) {
                console.log("Error fetching repositories:", err);
            }
        }

        fetchRepos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extract the owner and repo name from the URL using regex () captures the value in a group
        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) return alert("Invalid GitHub repository URL.");

        // Fetch the repository data (full_name and default_branch) from the backend
        try {
            const res = await api.post('/repositories', { owner: match[1], repo: match[2] });
            console.log('Repository data:', res.data);
            setRepos(prev => [...prev, res.data]);
            setSelectedRepo(res.data.full_name);
            // Pass the current owner, repo, default_branch to the parent component (Dashboard) using the updateCurrentRepo function
            props.updateCurrentRepo(match[1], match[2], res.data.default_branch);
        } catch (err) {
            console.error('Error fetching repository data:', err);
        }
    };

    // Function to delete the current repository
    const deleteRepo = async () => {
        setRepos(prev => prev.filter(repo => repo.full_name !== selectedRepo));
        const res = await api.delete("/repositories");
        console.log(res);
        setSelectedRepo('');
        props.updateCurrentRepo('', '', '');
    };

    return (
        <div className="flex flex-row w-full gap-4 pt-4">
            {/* Selector for repositories */}
            <Select
                variant="secondary"
                className="w-[256px]"
                placeholder="Select a repository"
                value={selectedRepo}
                onChange={value => {
                    setSelectedRepo(value);
                    const [owner, repo] = value.split('/');
                    const selected = repos.find(r => r.full_name === value);
                    props.updateCurrentRepo(owner, repo, selected.default_branch);
                }}
            >
                <Label /> {/* To avoid warnings in the console */}
                <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                </Select.Trigger>

                <Select.Popover className="dark:bg-zinc-800!">
                    <ListBox items={repos.map(repo => ({ id: repo.full_name, name: repo.full_name }))}>
                        {(item) => (
                            <ListBox.Item id={item.id} textValue={item.name}>
                                {item.name}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        )}
                    </ListBox>
                </Select.Popover>
            </Select>

            {/* Form to enter a github repo url */}
            <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 flex-1">
                <Input
                    aria-label="GitHub Repository URL"
                    type="url" 
                    placeholder="Enter a GitHub repo URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    variant="secondary"
                    className="flex-1"
                />

                <Button type="submit" variant="secondary">Add</Button>
            </form>

            {/* Button to analyze the current repo */}
            <Button variant="tertiary" className="text-success">Analyze</Button>

            {/* Modal for deleting the current repo */}
            <Modal>
                <Button slot="close" variant="danger-soft">Delete</Button>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>Confirm Delete</Modal.Heading>
                            </Modal.Header>

                            <Modal.Body>
                                Are you sure you want to delete this repository?
                            </Modal.Body>

                            <Modal.Footer>
                                <Button slot="close" variant="tertiary">Cancel</Button>
                                <Button
                                    slot="close"
                                    variant="danger"
                                    className="hover:bg-red-600"
                                    onPress={deleteRepo}
                                >
                                    Confirm
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    )
}