import { useState } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { FolderIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function FileNode(props) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(prev => !prev);

    if (props.node.type === "blob") {
        // This is a file
        return (
            <div className="ml-2 mr-2 text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg">
                <div className="flex flex-row ml-2 items-center gap-2 cursor-pointer py-1" onClick={() => props.updateSelectedFile(props.node.filePath)}>
                    <DocumentIcon className="w-4 h-4 text-gray-500" />
                    {props.node.name}
                </div>
            </div>
        )
    } else if (props.node.type === "tree") {
        // This is a directory
        return (
            <div className="flex flex-col">
                <div className="ml-2 mr-2 text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg">
                    <div className="flex flex-row ml-2 items-center gap-2 cursor-pointer py-1" onClick={toggleOpen}>
                        <FolderIcon className="w-4 h-4 text-gray-500" />
                        {props.node.name}
                    </div>
                </div>
                <div className="ml-2">
                    {/* If directory is open, show children */}
                    {isOpen && props.node.children && props.node.children.map((child, index) => (
                        <FileNode key={`${child.sha}-${index}`} node={child} updateSelectedFile={props.updateSelectedFile} />
                    ))}
                </div>
            </div>
        )
    }
    return null;
}