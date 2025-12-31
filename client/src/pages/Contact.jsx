import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Facebook, Twitter, Linkedin, Instagram, ChevronDown, ChevronUp } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import usePageContent from '../hooks/usePageContent';

const Contact = () => {
    usePageTitle('Contact Us');
    const { page } = usePageContent('contact');
    const header = page?.content?.header || {};

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const faqData = [
        {
            question: "What industries do you serve?",
            answer: "We specialize in high-risk industries including Oil & Gas, Construction, Manufacturing, Healthcare, and Aviation. Our platform is adaptable to any sector requiring rigorous safety compliance and training."
        },
        {
            question: "Can the VR training be customized?",
            answer: "Absolutely. Our team works closely with enterprise clients to recreate specific facility environments, machinery, and proprietary protocols to ensure training is 100% relevant to your workforce."
        },
        {
            question: "How does the LMS integration work?",
            answer: "Safe360 integrates seamlessly with major Human Resource Information Systems (HRIS) and existing Learning Management Systems via SCORM 1.2/2004, xAPI (Tin Can), and AICC standards."
        },
        {
            question: "Do you provide VR hardware?",
            answer: "We offer turnkey solutions that can include procuring pre-configured VR headsets (Meta Quest, HTC Vive, etc.). Alternatively, we can deploy our software onto your existing compatible hardware fleet."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('http://localhost:5001/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setFormData({ firstName: '', lastName: '', email: '', message: '' });
                // Reset success message after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setErrorMessage(data.message || 'Something went wrong');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="bg-white dark:bg-primary min-h-screen pt-20 transition-colors duration-300">
            <section className="py-20 text-center bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                    {header.title || (<span>Get in <span className="text-secondary">Touch</span></span>)}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
                    {header.description || "Ready to transform your corporate training? Let's start a conversation."}
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid md:grid-cols-2 gap-16 mb-24">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h2>
                        <div className="space-y-8 mb-12">
                            <div className="flex items-start">
                                <div className="bg-gray-100 dark:bg-white/10 p-3 rounded-lg mr-4 transition-colors">
                                    <Mail className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Us</h3>
                                    <p className="text-gray-600 dark:text-gray-400">hello@safe360.com</p>
                                    <p className="text-gray-600 dark:text-gray-400">support@safe360.com</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-gray-100 dark:bg-white/10 p-3 rounded-lg mr-4 transition-colors">
                                    <Phone className="h-6 w-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Call Us</h3>
                                    <p className="text-gray-600 dark:text-gray-400">+44 20 7123 4567</p>
                                    <p className="text-gray-600 dark:text-gray-400">Mon-Fri, 9am - 6pm GMT</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-gray-100 dark:bg-white/10 p-3 rounded-lg mr-4 transition-colors">
                                    <MapPin className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Visit Us</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Headquarters: London, UK</p>
                                    <p className="text-gray-600 dark:text-gray-400">Branch: Kathmandu, Nepal</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Connect With Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="bg-gray-100 dark:bg-white/5 p-3 rounded-lg hover:bg-secondary/20 hover:text-secondary transition-all text-gray-600 dark:text-gray-400">
                                    <Linkedin className="w-6 h-6" />
                                </a>
                                <a href="#" className="bg-gray-100 dark:bg-white/5 p-3 rounded-lg hover:bg-secondary/20 hover:text-secondary transition-all text-gray-600 dark:text-gray-400">
                                    <Twitter className="w-6 h-6" />
                                </a>
                                <a href="#" className="bg-gray-100 dark:bg-white/5 p-3 rounded-lg hover:bg-secondary/20 hover:text-secondary transition-all text-gray-600 dark:text-gray-400">
                                    <Facebook className="w-6 h-6" />
                                </a>
                                <a href="#" className="bg-gray-100 dark:bg-white/5 p-3 rounded-lg hover:bg-secondary/20 hover:text-secondary transition-all text-gray-600 dark:text-gray-400">
                                    <Instagram className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 relative overflow-hidden shadow-sm dark:shadow-none transition-colors">
                        {status === 'success' ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 z-10 bg-white dark:bg-gray-800 flex flex-col items-center justify-center text-center p-8 transition-colors"
                            >
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                                <p className="text-gray-600 dark:text-gray-400">Thank you for contacting us. We will get back to you shortly.</p>

                            </motion.div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900 dark:text-white outline-none transition-all" 
                                        placeholder="John" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900 dark:text-white outline-none transition-all" 
                                        placeholder="Doe" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900 dark:text-white outline-none transition-all" 
                                    placeholder="john@company.com" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Message</label>
                                <textarea 
                                    rows="4" 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900 dark:text-white outline-none transition-all" 
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={status === 'loading'}
                                className="w-full py-4 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-bold text-lg hover:opacity-90 transition-opacity flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? 'Sending...' : (
                                    <>Send Message <Send className="ml-2 h-5 w-5" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Maps Section */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our <span className="text-secondary">Locations</span></h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* London Map */}
                        <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pl-2">London HQ</h3>
                            <div className="w-full h-80 rounded-xl overflow-hidden relative">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.47340002653!2d-0.2416813892790853!3d51.52855824202246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2snp!4v1647856421321!5m2!1sen!2snp" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy"
                                    className="filter dark:grayscale dark:hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>
                        </div>

                        {/* Kathmandu Map */}
                        <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pl-2">Kathmandu Branch</h3>
                            <div className="w-full h-80 rounded-xl overflow-hidden relative">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31576360797!2d85.29111337024197!3d27.708955944409395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1647856503942!5m2!1sen!2snp" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy"
                                    className="filter grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Frequently Asked <span className="text-accent">Questions</span></h2>
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 transition-colors">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</span>
                                    {openFaqIndex === index ? (
                                        <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openFaqIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-white/5 pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
