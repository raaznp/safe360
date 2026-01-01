import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Logo from '../../assets/safe360-logo.png';
import TurnstileWidget from '../../components/TurnstileWidget';
import usePageTitle from '../../hooks/usePageTitle';

const Login = () => {
    usePageTitle('Admin Login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaToken) {
            setError('Please complete the captcha verification.');
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, captchaToken }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-primary transition-colors duration-300 relative">
            
            {/* Back to Home Link */}
            <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-secondary dark:hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 w-full max-w-md shadow-lg dark:shadow-none"
            >
                <div className="flex flex-col items-center mb-8">
                    <img src={Logo} alt="Safe360" className="h-12 w-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Portal</h1>
                </div>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 dark:text-gray-500" />
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900 dark:text-white outline-none transition-colors" 
                                placeholder="Enter username"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 dark:text-gray-500" />
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-gray-900 dark:text-white outline-none transition-colors" 
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Turnstile Captcha */}
                    <TurnstileWidget onVerify={(token) => setCaptchaToken(token)} />

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-secondary hover:bg-blue-600 text-white font-bold transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Sign In
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/forgot-password" className="text-sm text-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Forgot your password?
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
