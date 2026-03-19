import { useState, useEffect } from "react";
import api from "../axios";
import { ShikiHighlighter } from "react-shiki";
import { useTheme } from "../ThemeContext";

export default function CodeViewer(props) {
    const [code, setCode] = useState('');
    const [fileExtension, setFileExtension] = useState('');

    const { darkMode } = useTheme();

    // Get the file content
    useEffect(() => {
        const fetchContent = async () => {
            if (!props.owner || !props.repo || !props.file || !props.branch) {
                setCode("");
                setFileExtension("");
                return;
            }

            // Get the file extension for language
            const extension = props.file.split(".").pop();
            setFileExtension(extension);

            // Get the selected file's content
            try {
                const res = await api.get('/repo/file', {
                    params: {
                        owner: props.owner,
                        repo: props.repo,
                        path: props.file,
                        branch: props.branch
                    }
                });
                setCode(res.data.content);
            } catch (err) {
                console.log("Error fetching file content:", err);
            }
        }

        fetchContent()
    }, [props.file, props.branch]);
    
    return (
        <div className="flex-1 h-full flex flex-col rounded-lg text-[12px] overflow-hidden">
            {/* File path */}
            {props.file && (
                <div className="shrink-0 px-4 py-2 text-[11px] font-medium border-b bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700">
                    {props.file}
                </div>
            )}

            {/* Code Viewer */}
            <div className={`flex-1 overflow-auto ${darkMode ? "[&_pre]:bg-zinc-900!" : "[&_pre]:bg-zinc-50!"}`}>
                {code && (
                    <ShikiHighlighter
                        language={fileExtension}
                        theme={darkMode ? "dark-plus" : "light-plus"}
                        showLineNumbers
                    >
                        {code}
                    </ShikiHighlighter>
                )}
            </div>
        </div>
    )
}