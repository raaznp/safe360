import { motion } from 'framer-motion';
import { ArrowRight, Monitor, Headset, BarChart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import usePageTitle from '../hooks/usePageTitle';
import usePageContent from '../hooks/usePageContent';       

const Home = () => {
    usePageTitle('Home');
    const { page } = usePageContent('home');
    const hero = page?.content?.hero || {};
    const stats = page?.content?.stats || {};

    return (
        <div className="bg-white dark:bg-primary min-h-screen transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <img 
                        src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2078&auto=format&fit=crop" 
                        alt="VR Training Background" 
                        className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-40" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-gray-50/60 to-gray-50/80 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/80" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 dark:bg-white/5 border border-secondary/20 dark:border-white/10 text-secondary dark:text-accent text-sm font-medium mb-6 backdrop-blur-sm">
                            Next-Gen Corporate Training
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                            {hero.title || (
                                <>
                                    The Future of Learning <br />
                                    <span className="text-secondary dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-secondary dark:to-accent">Is Immersive</span>
                                </>
                            )}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            {hero.subtitle || "Safe360 combines advanced Learning Management Systems with cutting-edge VR/AR technology to create training experiences that stick."}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/products" className="px-8 py-4 rounded-full bg-secondary hover:bg-blue-600 text-white font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center">
                                {hero.ctaText || "Explore Solutions"} <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link to="/contact" className="px-8 py-4 rounded-full bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium text-lg transition-all backdrop-blur-sm shadow-sm dark:shadow-none">
                                Request Demo
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-12 bg-gray-100 dark:bg-gray-900 border-y border-gray-200 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">Trusted by Industry Leaders</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 dark:opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google', 'Siemens', 'Tesla', 'BP', 'Boeing'].map((partner) => (
                            <span key={partner} className="text-2xl font-bold text-gray-800 dark:text-white cursor-default hover:text-secondary transition-colors">{partner}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white dark:bg-primary relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Complete Training Ecosystem</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            From traditional modules to hyper-realistic simulations, we cover every aspect of corporate learning.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Monitor className="h-8 w-8 text-secondary" />,
                                title: "Advanced LMS",
                                desc: "Track progress, manage certifications, and deliver content seamlessly across all devices."
                            },
                            {
                                icon: <Headset className="h-8 w-8 text-accent" />,
                                title: "VR Simulations",
                                desc: "Risk-free practical training in hyper-realistic virtual environments."
                            },
                            {
                                icon: <BarChart className="h-8 w-8 text-purple-500" />,
                                title: "Deep Analytics",
                                desc: "Gain actionable insights into employee performance and skill gaps."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 hover:border-secondary/30"
                            >
                                <div className="mb-6 p-4 rounded-xl bg-white dark:bg-white/5 w-fit group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-300 shadow-sm dark:shadow-none">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VR Preview Section */}
            <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/5 dark:from-secondary/10 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-secondary dark:text-accent font-bold tracking-wider uppercase text-sm mb-2 block">Immersive Technology</span>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Train Like It's Real</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                                Traditional training methods have low retention rates. Our VR solutions provide hands-on experience without the real-world risks, boosting retention by up to 75%.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Hazard Recognition', 'Equipment Operation', 'Emergency Response', 'Soft Skills scenarios'].map((item, i) => (
                                    <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="h-5 w-5 text-secondary mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/products" className="text-secondary dark:text-white font-medium hover:text-blue-700 dark:hover:text-accent flex items-center transition-colors">
                                Learn more about VR <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-secondary to-accent opacity-20 dark:opacity-30 blur-2xl rounded-full" />
                            <img
                                src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=2070&auto=format&fit=crop"
                                alt="VR Training"
                                className="relative rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10"
                            />
                        </div>
                    </div>
                </div>
            </section>

             {/* Impact Stats Section */}
             <section className="py-20 bg-white dark:bg-primary border-y border-gray-200 dark:border-white/5 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center divide-x divide-gray-200 dark:divide-white/10">
                        {[
                            { label: stats.stat1Label || "Active Users", value: stats.stat1Value || "50,000+" },
                            { label: stats.stat2Label || "Training Modules", value: stats.stat2Value || "120+" },
                            { label: stats.stat3Label || "Enterprise Clients", value: stats.stat3Value || "85" },
                            { label: stats.stat4Label || "Accidents Prevented", value: stats.stat4Value || "30%" }
                        ].map((stat, i) => (
                            <div key={i} className="p-4">
                                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-secondary uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 bg-white dark:bg-primary relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Life at Safe360</h2>
                        <p className="text-gray-400">Collaborating across continents to build a safer future.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2069&auto=format&fit=crop"
                        ].map((img, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="rounded-xl overflow-hidden h-80 border border-white/5"
                            >
                                <img src={img} alt="Safe360 Office" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gray-50 dark:bg-primary text-center transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-16">What Our Clients Say</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { quote: "Safe360 completely transformed our onboarding process. Accidents are down by 30%.", author: "Sarah Connor", role: "Safety Director, Skynet Mfg" },
                            { quote: "The VR simulations are so realistic, our trainees actually feel like they are on site.", author: "James Kirk", role: "Training Lead, Starfleet Mining" },
                            { quote: "Best investment we've made for our workforce. The analytics are a game changer.", author: "Ellen Ripley", role: "Operations Manger, Weyland-Yutani" }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 relative shadow-sm dark:shadow-none"
                            >
                                <div className="text-secondary text-6xl absolute top-4 left-6 opacity-20">"</div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 italic relative z-10">{t.quote}</p>
                                <div>
                                    <h4 className="text-gray-900 dark:text-white font-bold">{t.author}</h4>
                                    <p className="text-gray-500 text-sm">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
