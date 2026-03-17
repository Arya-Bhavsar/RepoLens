import { useState, useRef, useEffect } from "react";
import { Input } from '@heroui/react';
import { Fragment } from "react";
import TypingIndicator from "./TypingIndicator";
import api from "../axios";

export default function ChatWindow({ owner, repo, messages, currentBranch, addMessage, updateLastMessage, loading, updateLoadingState }) {
    const [query, setQuery] = useState("");

    // Placed below the messages to scroll to the bottom automatically
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            const currentQuery = query;
            setQuery("");

            // Add a Loading... response before the LLM responds
            updateLoadingState(true);
            addMessage(query, null);

            try {
                const res = await api.post('/repo/chat', {
                    owner,
                    repo,
                    branch: currentBranch,
                    query: currentQuery
                });

                // Update the response after api call
                if (res.data.status !== "ready") {
                    updateLastMessage("Repository is still being analyzed, please try again in a moment.");
                } else {
                    updateLastMessage(res.data.answer);
                }
            } catch (err) {
                console.error("Error getting a response:", err);
                updateLastMessage("Error getting a response");
            } finally {
                updateLoadingState(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full pt-4 bg-white! dark:bg-zinc-950! border-l border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Chat Bubbles */}
            <div className="flex flex-col flex-1 p-4 gap-3 overflow-y-auto">
                {messages.map((msg, i) => (
                    <Fragment key={i}>
                        {/* Prompt */}
                        <div className="self-end max-w-[80%] px-3 py-2 text-white text-sm wrap-break-word bg-blue-500 rounded-tl-xl rounded-tr-xl rounded-bl-xl">
                            {msg.prompt}
                        </div>

                        {/* Response */}
                        <div className="self-start max-w-[80%] px-3 py-2 text-zinc-800 dark:text-zinc-100 text-sm wrap-break-word bg-zinc-200/50 dark:bg-zinc-800 rounded-tl-xl rounded-tr-xl rounded-br-xl">
                            {i === messages.length - 1 && loading ? <TypingIndicator /> : msg.answer}
                        </div>
                    </Fragment>
                ))}

                {/* Ref attached to this div to automatically scroll to the bottom */}
                <div ref={bottomRef} />
            </div>

            {/* Text Input */}
            <div className="flex flex-col mt-auto px-6 pb-6 w-full p-4 justify-center">
                <Input
                    aria-label='User Input'
                    type='text'
                    placeholder='Ask anything'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!repo || loading}
                    variant="secondary"
                />
                <p className="text-xs text-center text-zinc-400 mt-1 px-1">Ask anything aboout the repository or any of its files and directories</p>
            </div>
        </div>
    )
}