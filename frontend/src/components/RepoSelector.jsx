"use client";

import { useState } from 'react';
import { Button, Dropdown } from '@heroui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';

export default function RepoSelector() {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Handle form submission logic here
    }

    return (
        <div className="flex items-center max-w-screen bg-white dark:bg-zinc-800 rounded-lg p-4 gap-4 border border-zinc-200 dark:border-zinc-700">
            {/* Dropdown to select a repo */}
            <Dropdown>
                <Button className="flex items-center rounded px-2 py-1.5 bg-gray-50! dark:bg-zinc-900! border border-zinc-200! dark:border-zinc-700! text-gray-800! dark:text-gray-100!">
                    Select Repo
                    <ChevronUpDownIcon className="w-5 h-5"/>
                </Button>

                <Dropdown.Popover className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200! dark:border-zinc-700!">
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            Option 1
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Option 2
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Option 3
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>

            {/* Form to enter a github repo url */}
            <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 flex-1">
                <input 
                    type="url" 
                    placeholder="Enter a GitHub repo URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="flex-1 px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded transition-colors duration-200">Add</button>
            </form>

            {/* Button to analyze the current repo */}
            <button className="cursor-pointer bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded transition-colors duration-200">
                Analyze
            </button>

            {/* Button to delete the current repo */}
            <button className="cursor-pointer bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition-colors duration-200">
                Delete
            </button>
        </div>
    )
}