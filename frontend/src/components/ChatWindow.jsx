import { useState } from "react";
import { Input } from '@heroui/react';

export default function ChatWindow() {
    const [prompt, setPrompt] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && prompt.trim() !== "") {
            // Code here
        }
    };

    return (
        <div className="flex flex-col justify-between w-lg h-full bg-white! dark:bg-zinc-950! border-l border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Chat Bubbles */}

            {/* Text Input */}
            <div className="flex flex-col mt-auto px-6 pb-6 w-full p-4 justify-center">
                <Input
                    aria-label='User Input'
                    type='text'
                    placeholder='Ask anything'
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    variant="secondary"
                />
                <p className="text-xs text-center text-zinc-400 mt-1 px-1">Ask anything about the repository or the individual files</p>
            </div>
        </div>
    )
}