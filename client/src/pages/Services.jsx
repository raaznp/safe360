import { motion } from 'framer-motion';
import { Code, Terminal, Database, Cloud, Smartphone, CheckCircle, Palette, Megaphone, TrendingUp, PenTool, Shield, Headphones, ShoppingCart, BarChart, Globe } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';


import usePageContent from '../hooks/usePageContent';

const Services = () => {
    usePageTitle('Services');
    const { page } = usePageContent('services');
    const header = page?.content?.header || {};

    // Services data
    const servicesList = [
        {
            icon: <Code className="h-10 w-10 text-secondary" />,
            title: "Web Development",
            desc: "Full-stack web solutions using React, Node.js, and modern frameworks to build robust, scalable applications."
        },
        {
            icon: <Palette className="h-10 w-10 text-pink-500" />,
            title: "UI/UX Design",
            desc: "User-centric design that blends aesthetics with functionality. We create intuitive interfaces that delight users."
        },
        {
            icon: <Smartphone className="h-10 w-10 text-blue-400" />,
            title: "Mobile App Dev",
            desc: "Native and cross-platform mobile apps for iOS and Android that engage your workforce on the go."
        },
        {
            icon: <Megaphone className="h-10 w-10 text-yellow-500" />,
            title: "Digital Marketing",
            desc: "Data-driven marketing strategies to amplify your brand voice, including social media management and PPC campaigns."
        },
        {
            icon: <TrendingUp className="h-10 w-10 text-green-400" />,
            title: "SEO & Content",
            desc: "Optimize your online presence with search engine optimization and compelling content strategies that drive traffic."
        },
        {
            icon: <ShoppingCart className="h-10 w-10 text-indigo-500" />,
            title: "E-commerce Solutions",
            desc: "Build powerful online stores with secure payment gateways, inventory management, and seamless checkout experiences."
        },
        {
            icon: <Terminal className="h-10 w-10 text-accent" />,
            title: "VR/AR Consulting",
            desc: "Expert guidance on implementing immersive technologies. From strategy to deployment, we help you navigate the metaverse."
        },
        {
            icon: <Database className="h-10 w-10 text-purple-500" />,
            title: "LMS Integration",
            desc: "Seamlessly connect Safe360 with your existing HR and ERP systems. We support SCORM, xAPI, and custom API integrations."
        },
        {
            icon: <Cloud className="h-10 w-10 text-cyan-500" />,
            title: "Cloud Infrastructure",
            desc: "Scalable and secure cloud solutions (AWS/Azure) to ensure your applications are always available and performant."
        },
        {
            icon: <Shield className="h-10 w-10 text-red-500" />,
            title: "Cybersecurity",
            desc: "Protect your digital assets with rigorous security audits, penetration testing, and compliance monitoring."
        },
        {
            icon: <BarChart className="h-10 w-10 text-teal-500" />,
            title: "Data Analytics",
            desc: "Turn data into actionable insights with custom business intelligence dashboards and reporting tools."
        },
        {
            icon: <Headphones className="h-10 w-10 text-orange-500" />,
            title: "IT Support",
            desc: "24/7 technical support and maintenance packages to keep your business operations running smoothly without interruption."
        }
    ];

    return (
        <div className="bg-white dark:bg-primary min-h-screen pt-20 transition-colors duration-300">
            <section className="py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    {header.title || (<span>Professional <span className="text-secondary">Services</span></span>)}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
                    {header.description || "At Safe360, we offer a comprehensive suite of digital services to empower your business. From cutting-edge software development to strategic digital marketing, our expert team is dedicated to accelerating your growth and ensuring your success in the digital age."}
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {servicesList.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}

                            className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 hover:shadow-xl dark:hover:bg-white/10 transition-all hover:-translate-y-1 group"
                        >
                            <div className="mb-6 bg-gray-100 dark:bg-gray-900/50 w-fit p-4 rounded-xl group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                {service.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Industries Section */}
                <div className="mb-24">

                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Industries We Serve</h2>
                        <p className="text-gray-600 dark:text-gray-400">Tailored solutions for high-stakes environments.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Construction", desc: "Hazard recognition, equipment safety, and fall protection training." },
                            { title: "Manufacturing", desc: "Assembly line protocols, lockout/tagout, and ergonomic safety." },
                            { title: "Energy & Utilities", desc: "High voltage safety, confined space entry, and emergency response." },
                            { title: "Healthcare", desc: "Patient handling, infection control, and surgical simulations." },
                            { title: "Aviation", desc: "Flight safety protocols, maintenance crew training, and emergency procedures." },
                            { title: "Retail & E-commerce", desc: "Customer service handling, warehouse safety, and loss prevention." },
                            { title: "Logistics & Transport", desc: "Fleet management, driver safety, and supply chain optimization." },
                            { title: "Education", desc: "Virtual classrooms, campus safety protocols, and teacher training." },
                            { title: "Finance & Banking", desc: "Cybersecurity awareness, regulatory compliance, and fraud detection." },
                            { title: "Hospitality", desc: "Guest safety, food hygiene standards, and emergency evacuation." },
                            { title: "Telecommunications", desc: "Network infrastructure safety, tower climbing protocols, and data center operations." },
                            { title: "Agriculture", desc: "Farm equipment safety, chemical handling, and harvest operations." },
                            { title: "Automotive", desc: "Manufacturing plant safety, test drive protocols, and workshop compliance." },
                            { title: "Government", desc: "Public sector safety standards, emergency preparedness, and civic infrastructure." },
                            { title: "Real Estate", desc: "Property inspection safety, construction site visits, and facility management." },
                            { title: "Media & Entertainment", desc: "Set safety, crowd control, and equipment rigging protocols." }
                        ].map((ind, i) => (
                             <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}

                                className="bg-gradient-to-br from-gray-50 to-transparent dark:from-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5 hover:border-secondary/50 transition-colors"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{ind.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{ind.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Process Section */}
                <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Process</h2>
                     <p className="text-gray-600 dark:text-gray-400">How we turn your requirements into reality.</p>
                </div>
                <div className="grid md:grid-cols-5 gap-8">
                    {[
                        { step: "01", title: "Discovery", desc: "Understanding your needs and goals." },
                        { step: "02", title: "Strategy", desc: "Designing a tailored roadmap." },
                        { step: "03", title: "Build", desc: "Agile development and testing." },
                        { step: "04", title: "Launch", desc: "Deployment and user training." },
                        { step: "05", title: "Scale", desc: "Continuous support and improvements." }
                    ].map((phase, i) => (
                        <div key={i} className="text-center relative">
                            {i !== 4 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-secondary/50 to-transparent z-0"></div>}
                            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full border-2 border-secondary flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10 transition-colors duration-300">
                                {phase.step}
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{phase.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{phase.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
