import { useContext } from "react";
import { UserContext } from "../App";
import Header from "./Header";
import ProfileForm from "./ProfileForm";

export default function Account() {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-900">
            <Header />

            <div className="flex-1 overflow-auto">
                <div className="flex flex-col min-w-0 p-8 gap-6 max-w-5xl w-full mx-auto">
                    {/* Page title */}
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Account
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                            Manage your personal information and security
                        </p>
                    </div>

                    {/* Account settings content */}
                    <ProfileForm currentUser={currentUser} />
                </div>
            </div>
        </div>
    )
}