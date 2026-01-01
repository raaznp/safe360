import React, { useState } from 'react';
import { Edit, Trash, Briefcase, MapPin, Users } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

const JobList = ({ jobs, onEdit, onRefresh, onViewApplications }) => {
    const { success, error } = useToast();
    const token = localStorage.getItem('token');

    const handleDelete = async (id) => {
        if (window.confirm('Delete this job listing?')) {
            try {
                await fetch(`/api/careers/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                success('Job deleted successfully');
                onRefresh();
            } catch (err) {
                error('Failed to delete job');
            }
        }
    };

    return (
        <div className="grid gap-4">
            {jobs.map((job) => (
                <div key={job._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-start group hover:border-secondary transition-colors shadow-sm dark:shadow-none">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${job.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {job.active ? 'Active' : 'Closed'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {job.department}</span>
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</span>
                            <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button
                                onClick={() => onViewApplications(job._id)}
                                className="flex items-center px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                <Users className="w-3.5 h-3.5 mr-1.5" />
                                {job.applicationCount || 0} Applications
                            </button>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => onEdit(job)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Edit">
                            <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(job._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Delete">
                            <Trash className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobList;
