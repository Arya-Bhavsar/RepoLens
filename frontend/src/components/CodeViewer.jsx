import { useState, useEffect } from "react";
import api from "../axios";
import { ShikiHighlighter } from "react-shiki";

export default function CodeViewer(props) {
    const [code, setCode] = useState('');
    const [fileExtension, setFileExtension] = useState('');

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
        <div className="code-viewer flex-1 h-full overflow-auto rounded-lg text-[12px]">
            {code && <ShikiHighlighter
                language={fileExtension}
                theme="dark-plus"
                showLineNumbers
            >
                {code}
            </ShikiHighlighter>}
        </div>
)
}