"use client";

import { useState } from 'react';
import { Select, ListBox } from '@heroui/react';

export default function RepoSelector() {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Handle form submission logic here
    }

    return (
        <div className="flex items-center max-w-screen bg-white dark:bg-zinc-800 rounded-lg p-4 gap-4 border border-zinc-200 dark:border-zinc-700">
            {/* Selector for repositories */}
            <Select className="w-[256px]" placeholder="Select a repository">
                <Select.Trigger className="flex items-center rounded px-2 py-1.5 bg-gray-50! dark:bg-zinc-900! border border-zinc-200! dark:border-zinc-700!">
                    <Select.Value />
                    <Select.Indicator />
                </Select.Trigger>

                <Select.Popover className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200! dark:border-zinc-700!">
                    <ListBox>
                        <ListBox.Item id="1" textValue="Option 1">
                            Option 1
                        </ListBox.Item>
                        <ListBox.Item id="2" textValue="Option 2">
                            Option 2
                        </ListBox.Item>
                        <ListBox.Item id="3" textValue="Option 3">
                            Option 3
                        </ListBox.Item>
                    </ListBox>
                </Select.Popover>
            </Select>

            {/* Form to enter a github repo url */}
            <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 flex-1">
                <input 
                    type="url" 
                    placeholder="Enter a GitHub repo URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="flex-1 px-3 py-1.75 text-sm shadow border border-zinc-200! dark:border-zinc-700! bg-gray-50! dark:bg-zinc-900! text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.75 rounded transition-colors duration-200">Add</button>
            </form>

            {/* Button to analyze the current repo */}
            <button className="cursor-pointer bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.75 rounded transition-colors duration-200">
                Analyze
            </button>

            {/* Button to delete the current repo */}
            <button className="cursor-pointer bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1.75 rounded transition-colors duration-200">
                Delete
            </button>
        </div>
    )
}