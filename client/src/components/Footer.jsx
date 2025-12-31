import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../assets/safe360-logo.png';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-primary border-t border-gray-200 dark:border-white/10 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4 group">
                            <img src={Logo} alt="Safe360" className="h-10 w-auto" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
                            Revolutionizing corporate training with immersive VR/AR technologies and next-gen Learning Management Systems.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Linkedin className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Github className="h-5 w-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><Mail className="h-5 w-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6">Solutions</h4>
                        <ul className="space-y-3">
                            <li><Link to="/products" className="text-gray-400 hover:text-accent text-sm transition-colors">LMS Platform</Link></li>
                            <li><Link to="/products" className="text-gray-400 hover:text-accent text-sm transition-colors">VR Training</Link></li>
                            <li><Link to="/products" className="text-gray-400 hover:text-accent text-sm transition-colors">AR Assistance</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-accent text-sm transition-colors">Custom Development</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-gray-900 dark:text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-gray-400 hover:text-accent text-sm transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="text-gray-400 hover:text-accent text-sm transition-colors">Careers</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-accent text-sm transition-colors">Contact</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-accent text-sm transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-500 text-sm mb-4 md:mb-0 text-center md:text-left">
                        <p>© 2025 Safe360. All rights reserved.</p>

                    </div>
                    <p className="text-gray-600 text-xs text-center">Designed for the Future.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
