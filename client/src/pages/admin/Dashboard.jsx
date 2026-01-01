import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, FileText, Briefcase, MousePointer } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

const Dashboard = () => {
    usePageTitle('Admin Dashboard');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5001/api/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="text-gray-900 dark:text-white">Loading dashboard...</div>;
    if (!data) return <div className="text-gray-900 dark:text-white">Error loading data</div>;

    const chartData = data.visitors.data.map((val, i) => ({
        name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        visitors: val,
        inquiries: data.inquiries.data[i] * 10, // Scale for visibility
        views: data.blogViews.data[i]
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Visitors</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.visitors.total.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <span className="text-green-500 dark:text-green-400 text-sm mt-4 block">+{data.visitors.growth}% from last week</span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Active Jobs</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.activeJobs}</h3>
                        </div>
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Briefcase className="w-6 h-6 text-purple-500" />
                        </div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm mt-4 block">Current openings</span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Blog Views</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.blogViews.total.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <FileText className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <span className="text-green-500 dark:text-green-400 text-sm mt-4 block">+{data.blogViews.growth}% from last week</span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Inquiries</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.inquiries.total}</h3>
                        </div>
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <MousePointer className="w-6 h-6 text-orange-500" />
                        </div>
                    </div>
                    <span className="text-green-500 dark:text-green-400 text-sm mt-4 block">+{data.inquiries.growth}% from last week</span>
                </div>

                {/* New Blog Posts Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Blog Posts</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.blogPosts}</h3>
                        </div>
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <FileText className="w-6 h-6 text-indigo-500" />
                        </div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm mt-4 block">Published content</span>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Visitor Traffic</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Content Engagement</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                    cursor={{ fill: '#374151' }}
                                />
                                <Bar dataKey="views" fill="#10B981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
