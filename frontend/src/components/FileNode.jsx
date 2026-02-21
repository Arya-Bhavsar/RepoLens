import { useState } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { FolderIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function FileNode(props) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(prev => !prev);

    if (props.node.type === "blob") {
        // This is a file
        return (
            <div className="flex flex-row ml-2 items-center gap-2 cursor-pointer py-1">
                <DocumentIcon className="w-4 h-4 text-gray-500" />
                {props.node.name}
            </div>
        )
    } else if (props.node.type === "tree") {
        return (
            // This is a directory
            <div className="flex flex-col ml-2 py-1">
                <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={toggleOpen}>
                    <FolderIcon className="w-4 h-4 text-gray-500" />
                    {props.node.name}
                </div>
                {/* If directory is open, show children */}
                {isOpen && props.node.children && props.node.children.map((child, index) => (
                    <FileNode key={`${child.sha}-${index}`} node={child} />
                ))}
            </div>
        )
    }
    return null;
}