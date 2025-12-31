import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, Calendar, Mail, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

const ApplicationList = ({ jobId }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const { success, error } = useToast();
    const token = localStorage.getItem('token');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const url = jobId 
                ? `http://localhost:5001/api/careers/applications?job=${jobId}`
                : 'http://localhost:5001/api/careers/applications';
            
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setApplications(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5001/api/careers/applications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (res.ok) {
                success(`Status updated to ${newStatus}`);
                fetchApplications();
            }
        } catch (err) {
            error('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'reviewed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'interviewing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'hired': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredApplications = statusFilter === 'all' 
        ? applications 
        : applications.filter(app => app.status === statusFilter);

    return (
        <div className="space-y-4">
            <div className="flex gap-2 pb-4 overflow-x-auto">
                {['all', 'new', 'reviewed', 'interviewing', 'hired', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                            statusFilter === status 
                                ? 'bg-secondary text-white' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No applications found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredApplications.map(app => (
                        <div key={app._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {app.firstName} {app.lastName}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Applied for <span className="font-medium text-gray-900 dark:text-white">{app.job?.title || 'Unknown Job'}</span> • {new Date(app.appliedAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 pt-2">
                                        <a href={`mailto:${app.email}`} className="flex items-center hover:text-secondary group">
                                            <Mail className="w-4 h-4 mr-2 text-gray-400 group-hover:text-secondary" /> {app.email}
                                        </a>
                                        <a href={`tel:${app.phone}`} className="flex items-center hover:text-secondary group">
                                            <Phone className="w-4 h-4 mr-2 text-gray-400 group-hover:text-secondary" /> {app.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Update Status</label>
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-secondary outline-none dark:text-white"
                                    >
                                        <option value="new">New</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="interviewing">Interviewing</option>
                                        <option value="hired">Hired</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    
                                    <a
                                        href={app.resume}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center w-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors mt-2"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Resume
                                    </a>
                                </div>
                            </div>
                            
                            {app.coverLetter && (
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-1">Cover Letter</h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{app.coverLetter}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationList;
