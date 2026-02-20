import { Button, Dropdown } from '@heroui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/solid';

export default function RepoSelector() {
    return (
        <div className="flex items-center bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
            <Dropdown>
                <Button className="flex items-center justify-center rounded p-2 bg-white! dark:bg-zinc-900! border border-zinc-200! dark:border-zinc-700! text-gray-800! dark:text-gray-100!">
                    Select Repo
                    <ChevronUpDownIcon className="w-5 h-5"/>
                </Button>

                <Dropdown.Popover className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200! dark:border-zinc-700!">
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            Option 1
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Option 2
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Option 3
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </div>
    )
}