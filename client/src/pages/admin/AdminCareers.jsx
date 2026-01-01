import { useState, useEffect } from 'react';
import { Plus, Briefcase, FileText } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import JobList from './Careers/JobList';
import ApplicationList from './Careers/ApplicationList';
import JobEditor from './Careers/JobEditor';

const AdminCareers = () => {
    usePageTitle('Career Management');
    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null); // For application filtering
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    const token = localStorage.getItem('token');

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/careers/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreate = () => {
        setEditingJob(null);
        setShowModal(true);
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setShowModal(true);
    };

    const handleViewApplications = (jobId) => {
        setSelectedJobId(jobId);
        setActiveTab('applications');
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Career Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage job listings and track applications.</p>
                </div>
                {activeTab === 'jobs' && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center px-4 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Post Job
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit">
                <button
                    onClick={() => {
                        setActiveTab('jobs');
                        setSelectedJobId(null);
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'jobs'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Jobs
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'applications'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <FileText className="w-4 h-4 mr-2" />
                    Applications
                </button>
            </div>

            {/* Content */}
            <div className="bg-transparent min-h-[400px]">
                {activeTab === 'jobs' ? (
                    <JobList
                        jobs={jobs}
                        onEdit={handleEdit}
                        onRefresh={fetchJobs}
                        onViewApplications={handleViewApplications}
                    />
                ) : (
                    <div className="space-y-4">
                        {selectedJobId && (
                            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                <span className="text-sm text-blue-800 dark:text-blue-300">
                                    Viewing applications for <strong>{jobs.find(j => j._id === selectedJobId)?.title}</strong>
                                </span>
                                <button 
                                    onClick={() => setSelectedJobId(null)}
                                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Clear Filter
                                </button>
                            </div>
                        )}
                        <ApplicationList jobId={selectedJobId} />
                    </div>
                )}
            </div>

            <JobEditor
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                job={editingJob}
                onSuccess={fetchJobs}
            />
        </div>
    );
};

export default AdminCareers;
