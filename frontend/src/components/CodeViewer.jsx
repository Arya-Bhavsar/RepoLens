import { useState, useEffect } from "react";
import api from "../axios";
import { createHighlighter } from "shiki";

export default function CodeViewer(props) {
    const [codeHTML, setCodeHTML] = useState('');

    // Get the file content
    useEffect(() => {
        const fetchContent = async () => {
            if (!props.owner || !props.repo || !props.file || !props.branch) return;

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
                
                // Get the file extension for language
                const extension = props.file.split(".").pop();

                // Use Shiki to get highlighted code html
                const highlighter = await createHighlighter({
                    themes: ["dark-plus"],
                    langs: [extension]
                });
                const highlightedCode = highlighter.codeToHtml(res.data.content, {
                    lang: extension,
                    theme: "dark-plus"
                });

                setCodeHTML(highlightedCode);
            } catch (err) {
                console.log("Error fetching file content:", err);
            }
        }

        fetchContent()
    }, [props.file]);
    
    return (
    <>
        {/* This adds line numbers */}
        <style>{`
            .code-viewer code { counter-reset: line; }
            .code-viewer .line::before {
                counter-increment: line;
                content: counter(line);
                display: inline-block;
                width: 2rem;
                margin-right: 1.5rem;
                text-align: right;
                color: #666;
            }
        `}</style>
        <div 
            className="code-viewer flex-1 h-full overflow-auto rounded-lg text-[12px] [&_pre]:p-4"
            dangerouslySetInnerHTML={{ __html: codeHTML }} 
        />
    </>
)
}