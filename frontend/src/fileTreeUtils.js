// Helper function to sort the tree (folders and then files)
function sortTree(nodes) {
    nodes.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "tree" ? -1 : 1
    });

    nodes.forEach(node => {
        if (node.children?.length) sortTree(node.children)
    });
    return nodes
}

// Utility function to build a tree structure from a flat list of file paths
export default function buildTree(files) {
    const root = { name: "", type: "tree", children: [] };

    files.forEach(file => {
        const parts = file.path.split("/");
        let currentNode = root;

        // The type of the node is "blob" if it's a file, and "tree" if it's a directory
        parts.forEach((part, index) => {
            let childNode = currentNode.children.find(child => child.name === part)

            // If the child node doesn't exist, create it and add it to the current node's children
            if (!childNode) {
                childNode = {
                    name: part,
                    type: index - parts.length + 1 === 0 ? file.type : "tree",
                    children: []
                };
                currentNode.children.push(childNode);
            }
            currentNode = childNode;
        });
    });

    return sortTree(root.children); // Return the children of the root node, which is the actual file tree
}