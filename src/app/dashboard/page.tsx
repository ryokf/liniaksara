import {
    Users,
    Eye,
    ThumbsUp,
    Book,
    TrendingUp,
    Award,
    Clock
} from 'lucide-react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import { getUserDashboardStats } from '@/services/dashboardService';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';

// Komponen statistik card
function StatCard({ icon: Icon, label, value, trend }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    trend?: string;
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {label}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {value}
                    </h3>
                    {trend && (
                        <p className="flex items-center gap-1 text-green-500 text-sm mt-2">
                            <TrendingUp className="w-4 h-4" />
                            {trend}
                        </p>
                    )}
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
            </div>
        </div>
    );
}

// Komponen achievement card
function AchievementCard({ title, progress }: { title: string; progress: number }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <Award className="w-6 h-6 text-primary" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                    {title}
                </h4>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                    className="gradient-bg h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Progress: {progress}%
            </p>
        </div>
    );
}

// Komponen recent activity
import Image from 'next/image';
import type { DashboardWork } from '@/services/dashboardService';
import supabase from '@/config/supabase';
import { getUser } from '@/services/userServices';
import { FaDollarSign } from 'react-icons/fa';

function RecentWorkCard({ work }: { work: DashboardWork }) {
    return (
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="w-16 h-16 relative rounded-lg overflow-hidden mr-4">
                <Image 
                    src={work.cover || '/images/default-cover.svg'} 
                    alt={work.title} 
                    className="object-cover"
                    fill 
                    sizes="64px"
                />
            </div>
            <div className="flex-1">
                <h4 className="text-gray-900 dark:text-white font-medium mb-1">{work.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(work.created_at).toLocaleDateString()}
                </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300">{work.work_types.type}</span>
            </div>
        </div>
    );
}

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const stats = await getUserDashboardStats(session.user.id);

    // Data dummy untuk achievements - TODO: Implement achievements system
    const achievements = [
        { title: 'Penulis Bintang', progress: 75 },
        { title: 'Top Contributor', progress: 45 },
        { title: 'Social Butterfly', progress: 90 }
    ];

    return (
        <DashboardLayout activeMenu="/dashboard">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Dashboard Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome back! Here&apos;s what&apos;s happening with your content.
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={Book} label="Total Works" value={stats.totalWorks} />
                <StatCard icon={Users} label="Total Followers" value={stats.totalFollowers} />
                <StatCard icon={Eye} label="Total Views" value={stats.totalViews} />
                <StatCard icon={FaDollarSign} label="Balance" value={0} />
            </div>

            {/* Recent Works */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Works
                </h2>
                <div className="grid gap-4">
                    {stats.recentWorks.map((work) => (
                        <RecentWorkCard key={work.id} work={work} />
                    ))}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Transactions
                </h2>
                <div className="grid gap-4">
                    {stats.recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                                <Image 
                                    src={transaction.profiles.photo_url || '/images/default-avatar.svg'} 
                                    alt={transaction.profiles.username} 
                                    className="object-cover"
                                    fill
                                    sizes="48px"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-gray-900 dark:text-white font-medium">
                                    {transaction.profiles.username}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Purchased {transaction.works.title}
                                </p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements Section */}
            <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Achievements Progress
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                        <AchievementCard key={index} {...achievement} />
                    ))}
                </div>
            </section>
        </DashboardLayout>
    );
}
