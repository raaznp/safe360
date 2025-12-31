import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Star, Coffee } from 'lucide-react';
import { JOBS } from '../data/mockData';
import usePageTitle from '../hooks/usePageTitle';

const Careers = () => {
    usePageTitle('Careers');


    return (
        <div className="bg-white dark:bg-primary min-h-screen pt-20 transition-colors duration-300">
            <section className="py-20 text-center bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Join the <span className="text-secondary">Revolution</span></h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
                    Help us build the future of learning. We're looking for passionate innovators to join The Blue Team.
                </p>
            </section>

            {/* Culture Grid */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="text-center p-6">
                        <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">People First</h3>
                        <p className="text-gray-600 dark:text-gray-400">We prioritize the well-being and growth of our team members above all else.</p>
                    </div>
                    <div className="text-center p-6">
                        <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Excellence</h3>
                        <p className="text-gray-600 dark:text-gray-400">We strive for perfection in every pixel, every line of code, and every interaction.</p>
                    </div>
                    <div className="text-center p-6">
                        <Coffee className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Balance</h3>
                        <p className="text-gray-600 dark:text-gray-400">Flexible working hours and remote-first culture to maintain a healthy work-life balance.</p>
                    </div>
                </div>

                {/* Job Listings */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Open Positions</h2>
                <div className="space-y-4">
                    {JOBS.map((job, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group"
                            >
                                <div className="mb-4 md:mb-0 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-secondary transition-colors">{job.title}</h3>
                                    <div className="flex items-center justify-center md:justify-start space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1" /> {job.department}</span>
                                        <span>•</span>
                                        <span>{job.type}</span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                    </div>
                                </div>
                                <Link to={`/careers/apply/${job.id}`} className="px-6 py-2 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-white transition-all font-medium">
                                    Apply Now
                                </Link>
                            </motion.div>
                        ))}
                </div>
            </section>
        </div>
    );
};

export default Careers;
