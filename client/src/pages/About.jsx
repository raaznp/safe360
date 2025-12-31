
import { motion } from 'framer-motion';
import { Users, Target, Zap, Compass, Shield, Lightbulb, Heart, Award, Monitor, Eye, Clock, Briefcase, Globe, TrendingUp, CheckCircle, Layers, User, Mail, Linkedin, Github } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';


import usePageContent from '../hooks/usePageContent';
import useTeam from '../hooks/useTeam';

const About = () => {
    usePageTitle('About Us');
    const { page } = usePageContent('about');
    const { team } = useTeam();
    
    const main = page?.content?.main || {};
    const history = page?.content?.history || {};

    return (
        <div className="bg-white dark:bg-primary min-h-screen pt-20 transition-colors duration-300">
            {/* Header */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        {main.heading || (<span>About <span className="text-secondary">Safe360</span></span>)}
                    </motion.h1>
                    <div className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto prose dark:prose-invert">
                         {main.intro ? (
                             <div dangerouslySetInnerHTML={{ __html: main.intro }} />
                         ) : (
                             "We are The Blue Team, a collective of visionaries, developers, and educators dedicated to transforming how the world learns."
                         )}
                    </div>
                </div>
            </section>

            {/* Mission, Vision & Focus */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none"
                        >
                            <Target className="h-10 w-10 text-accent mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                To improve workplace safety and awareness through immersive, interactive training.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none"
                        >
                            <Eye className="h-10 w-10 text-secondary mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                To become a trusted provider of next-generation safety solutions for industrial sectors.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none"
                        >
                            <Compass className="h-10 w-10 text-green-400 mb-6" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Focus</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Replacing passive, traditional training with active, gamified discovery.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                     <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
                        <p className="text-gray-600 dark:text-gray-400">The principles that guide every decision we make.</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { title: "Safety", desc: "We never compromise on the safety of our users or our team." },
                            { title: "Innovation", desc: "We push the boundaries of what is possible with technology." },
                            { title: "Accessibility", desc: "Ensuring safety training is reachable for everyone, everywhere." },
                            { title: "Reliability", desc: "Building consistent, dependable systems you can trust." }
                        ].map((value, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-24 bg-white dark:bg-primary border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl transition-colors duration-300">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why Choose Safe360?</h2>
                                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                    We are more than just a training provider; we are your strategic partner in workforce transformation. Our unique blend of industrial expertise and technological innovation sets us apart.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="bg-secondary/20 p-3 rounded-lg mr-4 mt-1">
                                            <Award className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Proven Expertise</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">Founded by safety veterans with decades of on-site experience.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-accent/20 p-3 rounded-lg mr-4 mt-1">
                                            <Lightbulb className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Future-Ready Tech</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">Pioneering haptic feedback and volumetric capture integration.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-500/20 p-3 rounded-lg mr-4 mt-1">
                                            <Heart className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Human-Centric</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">Built for the frontline worker, not just the compliance officer.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start pt-4 border-t border-white/5">
                                        <div className="bg-blue-500/20 p-3 rounded-lg mr-4 mt-1">
                                            <Monitor className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Market Position</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                Scalable modular design compatible with browser-based learning and VR expansion.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"></div>
                                <img 
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Team Collaboration" 
                                    className="relative rounded-xl border border-white/10 shadow-lg"
                                />
                            </div>
                        </div>
                     </div>
                </div>
            </section>

            {/* Impact Metrics */}
            <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Impact by the Numbers</h2>
                        <p className="text-gray-600 dark:text-gray-400">Quantifiable results that demonstrate our commitment to safety excellence.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: "250+", label: "Clients", icon: Briefcase, color: "text-blue-500 dark:text-blue-400" },
                            { number: "50k+", label: "Workers", icon: Users, color: "text-green-500 dark:text-green-400" },
                            { number: "1M+", label: "Hours", icon: Clock, color: "text-purple-500 dark:text-purple-400" },
                            { number: "16", label: "Industries", icon: Layers, color: "text-yellow-500 dark:text-yellow-400" },
                            { number: "12", label: "Countries", icon: Globe, color: "text-cyan-500 dark:text-cyan-400" },
                            { number: "500+", label: "Scenarios", icon: Zap, color: "text-red-500 dark:text-red-400" },
                            { number: "40%", label: "Safe Rate", icon: TrendingUp, color: "text-orange-500 dark:text-orange-400" },
                            { number: "98%", label: "Retention", icon: CheckCircle, color: "text-emerald-500 dark:text-emerald-400" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center group hover:bg-white dark:hover:bg-white/10 transition-colors h-full flex flex-col items-center justify-center shadow-sm dark:shadow-none"
                            >
                                <div className={`w-12 h-12 mx-auto rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm dark:shadow-none`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Journey Section */}
             <section className="py-24 relative border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
                    </div>
                    <div className="space-y-12 relative border-l-2 border-secondary/20 dark:border-white/10 ml-4 md:ml-0 md:pl-0">
                        {[
                            { year: "2020", title: "Founded", desc: "Started in a small garage with a big vision to revolutionize safety training." },
                            { year: "2021", title: "Seed Funding", desc: "Raised $2M to build our core engineering team and prototype our VR engine." },
                            { year: "2022", title: "Beta Launch", desc: "Launched Safe360 Beta with 10 pilot enterprise customers." },
                            { year: "2023", title: "Global Expansion", desc: "Reached 100 enterprise customers across 3 continents." }
                        ].map((milestone, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative pl-8 md:pl-12"
                            >
                                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-secondary border-4 border-white dark:border-gray-900"></span>
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <span className="text-secondary font-bold text-xl md:w-24 mb-1 md:mb-0">{milestone.year}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{milestone.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{milestone.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900/30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet The Blue Team</h2>
                        <p className="text-gray-600 dark:text-gray-400">The minds behind the magic.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {(team.length > 0 ? team : [
                            { 
                                name: "Raj Kumar Nepal", 
                                role: "Group Leader, Project Manager, Full-Stack Developer", 
                                email: "bi70wr@student.sunderland.ac.uk" 
                            },
                             // Fallback to hardcoded if no team in DB (or loading)
                        ]).map((member, i) => (
                            <div key={member._id || i} className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/5 text-center group hover:shadow-xl dark:hover:bg-white/10 hover:border-secondary transition-all duration-300 flex flex-col items-center">
                                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                     {member.image ? (
                                         <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                     ) : (
                                        <User className="w-16 h-16 text-gray-400 group-hover:text-secondary transition-colors duration-300" />
                                     )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                                <p className="text-sm text-accent mb-6">{member.role}</p>
                                
                                <div className="flex items-center justify-center space-x-5">
                                    {member.email && (
                                        <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-secondary transition-colors">
                                            <Mail className="w-6 h-6" />
                                        </a>
                                    )}
                                    {member.social?.linkedin && (
                                        <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-secondary transition-colors">
                                            <Linkedin className="w-6 h-6" />
                                        </a>
                                    )}
                                    {member.social?.twitter && (
                                        <a href={member.social.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-secondary transition-colors">
                                            <Github className="w-6 h-6" /> 
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
