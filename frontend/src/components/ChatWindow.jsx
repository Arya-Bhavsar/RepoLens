import { useState, useRef, useEffect } from "react";
import { Input } from '@heroui/react';
import { Fragment } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../ThemeContext";
import TypingIndicator from "./TypingIndicator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../axios";

export default function ChatWindow({ owner, repo, messages, currentBranch, addMessage, updateLastMessage, loading, updateLoadingState }) {
    const [query, setQuery] = useState("");

    // Placed below the messages to scroll to the bottom automatically
    const bottomRef = useRef(null);

    const { darkMode } = useTheme();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            const currentQuery = query;
            setQuery("");

            const currentHistory = [...messages]

            // Add a Loading... response before the LLM responds
            updateLoadingState(true);
            addMessage(query, null);

            try {
                const res = await api.post('/repo/chat', {
                    owner,
                    repo,
                    branch: currentBranch,
                    query: currentQuery,
                    history: currentHistory // Skips the last Loading... message
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

    // Used by ReactMarkdown to syntax highlight code inside a block
    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={darkMode ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: 0, borderRadius: '0.375rem' }}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            )
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
                        {i === messages.length - 1 && loading 
                            ? (
                                <div className="self-start px-3 py-2 bg-zinc-200/50 dark:bg-zinc-800 rounded-tl-xl rounded-tr-xl rounded-br-xl">
                                    <TypingIndicator />
                                </div>
                            ) : (
                                <div className="self-start max-w-[90%] text-sm prose prose-sm dark:prose-invert prose-zinc">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{msg.answer}</ReactMarkdown>
                                </div>
                            )
                        }
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