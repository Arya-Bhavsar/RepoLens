"use client";

import { useState } from 'react';
import { Select, ListBox, Modal, Button, Input, Card } from '@heroui/react';

export default function RepoSelector() {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Handle form submission logic here
    }

    return (
        <Card variant="transparent" className="w-full items-stretch md:flex-row">
            {/* Selector for repositories */}
            <Select variant="secondary" className="w-[256px]" placeholder="Select a repository">
                <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                    <ListBox>
                        <ListBox.Item id="1" textValue="Option 1">
                            Option 1
                        </ListBox.Item>
                        <ListBox.Item id="2" textValue="Option 2">
                            Option 2
                        </ListBox.Item>
                        <ListBox.Item id="3" textValue="Option 3">
                            Option 3
                        </ListBox.Item>
                    </ListBox>
                </Select.Popover>
            </Select>

            {/* Form to enter a github repo url */}
            <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 flex-1">
                <Input
                    aria-label="Name"
                    type="url" 
                    placeholder="Enter a GitHub repo URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    variant="secondary"
                    className="flex-1"
                />

                <Button type="submit" variant="primary" className="hover:bg-blue-600">Add</Button>
            </form>

            {/* Button to analyze the current repo */}
            <Button variant="primary" className="bg-green-600 hover:bg-green-700">Analyze</Button>

            {/* Modal for deleting the current repo */}
            <Modal>
                <Button slot="close" variant="danger" className="hover:bg-red-600">Delete</Button>

                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>Confirm Delete</Modal.Heading>
                            </Modal.Header>

                            <Modal.Body>
                                Are you sure you want to delete this repository?
                            </Modal.Body>

                            <Modal.Footer>
                                <Button slot="close" variant="tertiary">Cancel</Button>
                                <Button slot="close" variant="danger" className="hover:bg-red-600">Confirm</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </Card>
    )
}