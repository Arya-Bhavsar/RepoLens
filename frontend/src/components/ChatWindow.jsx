import { useState, useRef, useEffect } from "react";
import { Input } from '@heroui/react';
import { Fragment } from "react";

export default function ChatWindow(props) {
    const [query, setQuery] = useState("");

    // Placed below the messages to scroll to the bottom automatically
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.messages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            props.addMessage(query, "Test answer");
            setQuery("");
        }
    };

    return (
        <div className="flex flex-col h-full pt-4 bg-white! dark:bg-zinc-950! border-l border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Chat Bubbles */}
            <div className="flex flex-col flex-1 p-4 gap-3 overflow-y-auto">
                {props.messages.map((msg, i) => (
                    <Fragment key={i}>
                        {/* Prompt */}
                        <div className="self-end max-w-[80%] px-3 py-2 text-white text-sm wrap-break-word bg-blue-500 rounded-tl-xl rounded-tr-xl rounded-bl-xl">
                            {msg.prompt}
                        </div>

                        {/* Response */}
                        <div className="self-start max-w-[80%] px-3 py-2 text-zinc-800 dark:text-zinc-100 text-sm wrap-break-word bg-zinc-200/50 dark:bg-zinc-800 rounded-tl-xl rounded-tr-xl rounded-br-xl">
                            {msg.answer}
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
                    disabled={!props.repo}
                    variant="secondary"
                />
                <p className="text-xs text-center text-zinc-400 mt-1 px-1">Ask about a repository or specific files by tagging them (@filename)</p>
            </div>
        </div>
    )
}