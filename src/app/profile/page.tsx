"use client";

export default function ProfilePage() {
    return (
        <main className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Profile
                </h1>
                
                {/* Profile Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="space-y-6">
                        {/* Profile Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Username
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    user@example.com
                                </p>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Bio
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                No bio added yet.
                            </p>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4 py-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Works</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
