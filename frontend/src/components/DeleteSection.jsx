import { useContext, useState } from "react";
import { UserContext } from "../App";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { supabase } from "../supabase";
import api from "../axios";

export default function DeleteSection() {
    const [showModal, setShowModal] = useState(false);

    const { setCurrentUser } = useContext(UserContext);

    const handleDelete = async () => {
        await api.delete("/me");
        await supabase.auth.signOut();
        setCurrentUser(null);
    }

    return (
        <>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-red-300 dark:border-red-400 p-6">
                {/* Card title */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Danger Zone</h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Irreversible actions</p>
                    </div>
                </div>

                {/* Delete account section */}
                <div className="flex items-center justify-between">
                    {/* Disclaimer */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Delete account</h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Permanently delete your account and all associated data</p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-100 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400 transition-colors cursor-pointer"
                    >
                        Delete account
                    </button>
                </div>
            </div>

            {/* Delete account modal */}
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white! dark:bg-zinc-800! rounded-xl shadow-lg p-6 w-full max-w-md"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-center w-9 h-9 mb-4 rounded-xl bg-red-50 dark:bg-red-500/10">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Delete Account</h2>

                        {/* Disclaimer */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
                            This will permanently delete your account and all associated data. This action cannot be undone.
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg dark:text-white border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg text-gray-100 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400 transition-colors cursor-pointer"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}