import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import JoditEditor from 'jodit-react';
import { useToast } from '../../../contexts/ToastContext';

const JobEditor = ({ isOpen, onClose, job, onSuccess }) => {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const editor = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        type: 'Full-time',
        location: '',
        department: '',
        description: '',
        requirements: '',
        active: true
    });

    useEffect(() => {
        if (job) {
            setFormData({
                ...job,
                requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements
            });
        } else {
            setFormData({
                title: '',
                type: 'Full-time',
                location: '',
                department: '',
                description: '',
                requirements: '',
                active: true
            });
        }
    }, [job, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = job
            ? `http://localhost:5001/api/careers/${job._id}`
            : 'http://localhost:5001/api/careers';

        const method = job ? 'PUT' : 'POST';
        const token = localStorage.getItem('token');

        const payload = {
            ...formData,
            requirements: typeof formData.requirements === 'string'
                ? formData.requirements.split('\n').filter(r => r.trim())
                : formData.requirements
        };

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                success(job ? 'Job updated successfully' : 'Job posted successfully');
                onSuccess();
                onClose();
            } else {
                error(data.message || 'Something went wrong');
            }
        } catch (err) {
            error('Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {job ? 'Edit Job' : 'Post New Job'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Job Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Department</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Location</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Type</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Remote</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Description</label>
                        <div className="dark:text-black">
                            <JoditEditor
                                ref={editor}
                                value={formData.description}
                                onBlur={newContent => setFormData({ ...formData, description: newContent })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Requirements (One per line)</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                        />
                        <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-400">Active (Visible to public)</label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center"
                        >
                            {loading ? 'Saving...' : 'Save Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobEditor;
