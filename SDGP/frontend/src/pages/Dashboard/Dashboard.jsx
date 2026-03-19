import React from 'react';
import { FiTrendingUp, FiBookOpen, FiUser, FiSettings } from 'react-icons/fi';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Welcome Back, User! 👋</h1>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={<FiTrendingUp/>} title="Job Trends" value="Live" color="bg-blue-500" link="/job-trends" />
                    <StatCard icon={<FiBookOpen/>} title="My Skills" value="12" color="bg-purple-500" link="/skills" />
                    <StatCard icon={<FiUser/>} title="Profile" value="80%" color="bg-green-500" link="/profile" />
                    <StatCard icon={<FiSettings/>} title="Settings" value="Update" color="bg-slate-500" link="/settings" />
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-slate-700">Recent Career Insights</h2>
                    <div className="space-y-4">
                        <ActivityItem title="AI Engineer demand increased by 15%" time="2 hours ago" />
                        <ActivityItem title="New skill path added: Data Science" time="5 hours ago" />
                        <ActivityItem title="Your profile was viewed by 3 recruiters" time="Yesterday" />
                    </div>
                </div>
            </div>
        </div>
    );
};


const StatCard = ({ icon, title, value, color, link }) => (
    <a href={link} className="block transition-transform hover:scale-105">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`${color} p-3 rounded-lg text-white text-xl`}>{icon}</div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    </a>
);

const ActivityItem = ({ title, time }) => (
    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
        <span className="text-slate-700 font-medium">{title}</span>
        <span className="text-slate-400 text-sm">{time}</span>
    </div>
);

export default Dashboard;