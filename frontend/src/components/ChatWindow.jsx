import { useState } from "react";
import { Input } from '@heroui/react';

export default function ChatWindow() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && prompt.trim() !== "") {
            setMessages(prev => [...prev, prompt])
            setPrompt("");
        }
    };

    return (
        <div className="flex flex-col justify-between h-full bg-white! dark:bg-zinc-950! border-l border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Chat Bubbles */}
            <div className="flex flex-col p-4 gap-4">
                {messages.map((msg, i) => (
                    <div key={i} className="self-end max-w-[80%] px-3 py-2 text-white text-sm wrap-break-word bg-blue-500 rounded-tl-xl rounded-tr-xl rounded-bl-xl">
                        {msg}
                    </div>
                ))}
            </div>

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
                <p className="text-xs text-center text-zinc-400 mt-1 px-1">Ask about a repository or specific files by tagging them (@filename)</p>
            </div>
        </div>
    )
}