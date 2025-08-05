import {
    Users,
    Eye,
    ThumbsUp,
    MessageSquare,
    TrendingUp,
    Award
} from 'lucide-react';
import DashboardLayout from '@/components/templates/DashboardLayout';

// Komponen statistik card
function StatCard({ icon: Icon, label, value, trend }: {
    icon: React.ElementType;
    label: string;
    value: string;
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

// Data dummy untuk statistik
const stats = [
    { icon: Users, label: 'Total Pengikut', value: '2,543', trend: '+12% bulan ini' },
    { icon: Eye, label: 'Total Views', value: '45.2K', trend: '+25% bulan ini' },
    { icon: ThumbsUp, label: 'Total Likes', value: '12.8K', trend: '+18% bulan ini' },
    { icon: MessageSquare, label: 'Total Komentar', value: '1,289', trend: '+7% bulan ini' }
];

// Data dummy untuk achievements
const achievements = [
    { title: 'Penulis Bintang', progress: 75 },
    { title: 'Top Contributor', progress: 45 },
    { title: 'Social Butterfly', progress: 90 }
];

export default function DashboardPage() {
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
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
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
