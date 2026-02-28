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
        <div className={`code-viewer flex-1 h-full overflow-auto rounded-lg text-[12px] ${darkMode ? "[&_pre]:bg-zinc-900!" : "[&_pre]:bg-zinc-50!"}`}>
            {code && <ShikiHighlighter
                language={fileExtension}
                theme={darkMode ? "dark-plus" : "light-plus"}
                showLineNumbers
            >
                {code}
            </ShikiHighlighter>}
        </div>
    )
}