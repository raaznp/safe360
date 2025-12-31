import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { JOBS } from '../data/mockData';
import usePageTitle from '../hooks/usePageTitle';

const ApplicationPage = () => {
    const { id } = useParams();
    const job = JOBS.find(j => j.id === parseInt(id));
    const [submitted, setSubmitted] = useState(false);

    usePageTitle(job ? `Apply for ${job.title}` : 'Job Not Found');

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-primary pt-32 px-4 text-center transition-colors duration-300">
                <h1 className="text-3xl text-gray-900 dark:text-white mb-4">Job Not Found</h1>
                <Link to="/careers" className="text-secondary hover:text-blue-700 dark:hover:text-white">Back to Careers</Link>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (

            <div className="min-h-screen bg-white dark:bg-primary pt-32 px-4 flex items-center justify-center transition-colors duration-300">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 text-center shadow-lg dark:shadow-none"
                >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Received!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Thanks for applying to be a {job.title}. We'll review your info and get back to you shortly.
                    </p>
                    <Link to="/careers" className="px-6 py-3 rounded-full bg-secondary text-white font-medium hover:bg-blue-600 transition-colors">
                        Back to Careers
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-primary min-h-screen pt-24 pb-20 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <Link to="/careers" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
                </Link>

                <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-8 mb-8 shadow-sm dark:shadow-none">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Apply for {job.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{job.department} • {job.location}</p>
                    <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About the Role</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{job.description}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">First Name</label>
                            <input type="text" required className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Last Name</label>
                            <input type="text" required className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Email Address</label>
                        <input type="email" required className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Phone</label>
                        <input type="tel" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Resume/CV</label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg p-8 text-center hover:border-secondary/50 transition-colors cursor-pointer group bg-gray-50 dark:bg-transparent">
                            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3 group-hover:text-secondary transition-colors" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">PDF, DOCX up to 5MB</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Cover Letter (Optional)</label>
                        <textarea rows="4" className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors"></textarea>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-secondary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationPage;
