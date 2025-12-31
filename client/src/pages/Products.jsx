import { motion } from 'framer-motion';
import { Box, Layers, Smartphone, Globe, BarChart, Check, X } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';


import usePageContent from '../hooks/usePageContent';

const Products = () => {
    usePageTitle('Products');
    const { page } = usePageContent('products');
    const header = page?.content?.header || {};

    return (
        <div className="bg-white dark:bg-primary min-h-screen pt-20 transition-colors duration-300">
            <section className="py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    {header.title || (<span>Our <span className="text-accent">Solutions</span></span>)}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
                    {header.description || "Discover our suite of cutting-edge tools designed to elevate your workforce's safety and performance. Whether you need a robust Learning Management System to track compliance or hyper-realistic Virtual Reality simulations to train for high-risk scenarios, Safe360 has the technology to transform your training operations."}
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {/* Safe360 LMS */}
                <div className="mb-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                                <Layers className="w-4 h-4 mr-2" /> Core Platform
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Safe360 LMS</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                                A comprehensive Learning Management System built for the modern enterprise. Manage courses, track compliance, and generate detailed reports with ease.
                            </p>
                            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center"><Box className="w-5 h-5 text-accent mr-3" /> Intuitive Dashboard</li>
                                <li className="flex items-center"><Box className="w-5 h-5 text-accent mr-3" /> Role-based Access Control</li>
                                <li className="flex items-center"><Box className="w-5 h-5 text-accent mr-3" /> Automated Certification</li>
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-800 rounded-xl p-2 shadow-2xl border border-white/10"
                        >
                            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" alt="LMS Dashboard" className="rounded-lg opacity-80" />
                        </motion.div>
                    </div>
                </div>

                {/* VR Training */}
                <div className="mb-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1 bg-gray-800 rounded-xl p-2 shadow-2xl border border-white/10"
                        >
                            <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2078&auto=format&fit=crop" alt="VR Training" className="rounded-lg opacity-80" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                                <Globe className="w-4 h-4 mr-2" /> Immersive Tech
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">VR Training Suites</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                                Step into the future with our Virtual Reality training modules. Replicate hazardous scenarios safely and build muscle memory without the risk.
                            </p>
                            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center"><Box className="w-5 h-5 text-secondary mr-3" /> 360° Environment Scanning</li>
                                <li className="flex items-center"><Box className="w-5 h-5 text-secondary mr-3" /> Haptic Feedback Integration</li>
                                <li className="flex items-center"><Box className="w-5 h-5 text-secondary mr-3" /> Real-time Performance Metrics</li>
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* Safe360 Mobile App */}
                <div className="mb-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
                                <Smartphone className="w-4 h-4 mr-2" /> On-the-Go Safety
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Safe360 Mobile App</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                                Empower your field workers with a powerful mobile companion. Report incidents instantly, access training manuals offline, and receive real-time safety alerts.
                            </p>
                            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center"><Box className="w-5 h-5 text-blue-400 mr-3" /> Instant Incident Reporting</li>
                                <li className="flex items-center"><Box className="w-5 h-5 text-blue-400 mr-3" /> Offline Mode Support</li>
                                <li className="flex items-center"><Box className="w-5 h-5 text-blue-400 mr-3" /> Push Safety Notifications</li>
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-800 rounded-xl p-2 shadow-2xl border border-white/10"
                        >
                            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop" alt="Mobile App Interface" className="rounded-lg opacity-80" />
                        </motion.div>
                    </div>
                </div>

                {/* Analytical Engine */}
                <div className="mb-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1 bg-gray-800 rounded-xl p-2 shadow-2xl border border-white/10"
                        >
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Analytics Dashboard" className="rounded-lg opacity-80" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-4">
                                <BarChart className="w-4 h-4 mr-2" /> Data Intelligence
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Predictive Analytics</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                                Move from reactive to proactive safety management. Our AI-driven analytics engine identifies potential risks before they become accidents, keeping your workforce safer.
                            </p>
                            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                <li className="flex items-center"><Box className="w-5 h-5 text-green-400 mr-3" /> Predictive Risk Modeling</li>
                                <li className="flex items-center"><Box className="w-5 h-5 text-green-400 mr-3" /> Compliance Trend Analysis</li>
                                <li className="flex items-center"><Box className="w-5 h-5 text-green-400 mr-3" /> Custom ROI Reports</li>
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* Tech Specs Section */}
                <div className="mb-24">
                     <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Technical Specifications</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-secondary font-bold mb-4 uppercase tracking-wider text-sm">VR Hardware Requirements</h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li className="flex items-center"><Box className="w-4 h-4 mr-2 text-gray-600" /> Supported Headsets: Meta Quest 2/3, HTC Vive Focus 3, Pico 4 Enterprise</li>
                                    <li className="flex items-center"><Box className="w-4 h-4 mr-2 text-gray-600" /> Network: Wi-Fi 6 Recommended for multi-user sessions</li>
                                    <li className="flex items-center"><Box className="w-4 h-4 mr-2 text-gray-600" /> Space: 2m x 2m clear area for room-scale VR</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-accent font-bold mb-4 uppercase tracking-wider text-sm">LMS Capabilities</h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li className="flex items-center"><Box className="w-4 h-4 mr-2 text-gray-600" /> Standards: SCORM 1.2/2004, xAPI (Tin Can), AICC</li>
                                    <li className="flex items-center"><Box className="w-4 h-4 mr-2 text-gray-600" /> SSO: SAML 2.0, OAuth 2.0, OpenID Connect</li>
                                    <li className="flex items-center"><Box className="w-4 h-4 mr-2 text-gray-600" /> Hosting: Cloud (AWS/Azure) or On-Premise via Docker containers</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Comparison */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Compare Editions</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10 text-lg font-bold text-gray-900 dark:text-white">Feature</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10 text-lg font-bold text-secondary">Standard</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10 text-lg font-bold text-accent">Professional</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10 text-lg font-bold text-purple-500">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 dark:text-gray-400">
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">LMS Access</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><Check className="text-green-500 w-5 h-5"/></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><Check className="text-green-500 w-5 h-5"/></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><Check className="text-green-500 w-5 h-5"/></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">Mobile App</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><Check className="text-green-500 w-5 h-5"/></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><Check className="text-green-500 w-5 h-5"/></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><Check className="text-green-500 w-5 h-5"/></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">VR Training Modules</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">5 Modules</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">20 Modules</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Unlimited</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">User Seats</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Up to 50</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Up to 500</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Unlimited</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">Cloud Storage</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">100 GB</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">1 TB</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Unlimited</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">Analytics</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Basic</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Advanced</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Predictive AI</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">Custom Branding</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><X className="text-red-500 w-5 h-5"/></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Logo Upload</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Full White-label</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">API Access</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><X className="text-red-500 w-5 h-5"/></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><Check className="text-green-500 w-5 h-5"/></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><Check className="text-green-500 w-5 h-5"/></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">Onboarding</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Self-service</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Webinar</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">On-site</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5">Support</td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Email</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">24/7 Chat</span></td>
                                    <td className="p-4 border-b border-gray-200 dark:border-white/5"><span className="text-sm">Dedicated Manager</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Coming Soon */}
            <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-16">Coming Soon</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                         <div className="bg-gradient-to-br from-secondary/20 to-transparent p-1 rounded-2xl">
                            <div className="bg-gray-50 dark:bg-gray-900 h-full p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-lg transition-all">
                                <div className="absolute inset-0 bg-secondary/5 group-hover:bg-secondary/10 transition-colors"></div>
                                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                                    <Box className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Safety Assistant</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Intelligent companion answering safety queries in real-time.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-accent/20 to-transparent p-1 rounded-2xl">
                             <div className="bg-gray-50 dark:bg-gray-900 h-full p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-lg transition-all">
                                <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors"></div>
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6 text-accent">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mixed Reality Headset</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Proprietary hardware for industrial environments.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500/20 to-transparent p-1 rounded-2xl">
                             <div className="bg-gray-50 dark:bg-gray-900 h-full p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-lg transition-all">
                                <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
                                    <Smartphone className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Biometric Integration</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Real-time health monitoring via wearable devices.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-1 rounded-2xl">
                             <div className="bg-gray-50 dark:bg-gray-900 h-full p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-lg transition-all">
                                <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 text-purple-500">
                                    <Layers className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Digital Twin</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">1:1 digital replicas of your facilities for remote inspection.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Products;
