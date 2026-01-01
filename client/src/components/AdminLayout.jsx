import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, LogOut, Menu, X, Mail, Settings, User, Image, Folder, ChevronDown, ChevronRight, Hash, FolderTree, Plus, List, Globe, Box, Shield } from 'lucide-react';
import ScrollToTopButton from './ScrollToTopButton';
import Logo from '../assets/safe360-logo.png';
import Icon from '../assets/icon.png';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // State to track expanded submenus. key: item.name
    const [expandedMenus, setExpandedMenus] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const mainRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const toggleSubmenu = (name) => {
        setExpandedMenus(prev => 
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        );
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Careers', path: '/admin/careers', icon: <Briefcase className="w-5 h-5" /> },
        { 
            name: 'Blog', 
            icon: <FileText className="w-5 h-5" />,
            submenu: [
                { name: 'All Posts', path: '/admin/blog', icon: <List className="w-4 h-4" /> },
                { name: 'New Post', path: '/admin/blog/new', icon: <Plus className="w-4 h-4" /> },
                { name: 'Categories', path: '/admin/blog/categories', icon: <FolderTree className="w-4 h-4" /> },
                { name: 'Tags', path: '/admin/blog/tags', icon: <Hash className="w-4 h-4" /> },
            ]
        },
        {
            name: 'Pages',
            icon: <Globe className="w-5 h-5" />,
            submenu: [
                { name: 'Home', path: '/admin/pages/home', icon: <LayoutDashboard className="w-4 h-4" /> },
                { name: 'About', path: '/admin/pages/about', icon: <FileText className="w-4 h-4" /> },
                { name: 'Services', path: '/admin/pages/services', icon: <Briefcase className="w-4 h-4" /> },
                { name: 'Products', path: '/admin/pages/products', icon: <Box className="w-4 h-4" /> },
                { name: 'Contact', path: '/admin/pages/contact', icon: <Mail className="w-4 h-4" /> },
                { name: 'Privacy', path: '/admin/pages/privacy', icon: <Shield className="w-4 h-4" /> },
                { name: 'Team', path: '/admin/team', icon: <Users className="w-4 h-4" /> },
            ]
        },
        { name: 'Messages', path: '/admin/messages', icon: <Mail className="w-5 h-5" /> },
        { name: 'Media Library', path: '/admin/media', icon: <Image className="w-5 h-5" /> },
        { name: 'Files', path: '/admin/files', icon: <Folder className="w-5 h-5" /> },
    ];

    const bottomNavItems = [
        { name: 'Profile', path: '/admin/profile', icon: <User className="w-5 h-5" /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    const isActive = (path) => location.pathname === path;
    const isSubActive = (submenu) => submenu.some(item => location.pathname === item.path);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col fixed h-full z-20`}>
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                     {sidebarOpen ? (
                        <img src={Logo} alt="Safe360" className="h-8 w-auto transition-all duration-300" />
                    ) : (
                        <img src={Icon} alt="Safe360" className="h-8 w-8 transition-all duration-300" />
                    )}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                         if (item.submenu) {
                            const isOpen = expandedMenus.includes(item.name);
                             // If sidebar is closed, we can't show submenu nicely inline. 
                             // For now we might just link to main if sidebar closed or default behavior.
                             // Complex sidebar behavior simplified: if closed, hiding submenu or showing only icon.
                             
                             return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => {
                                            if (!sidebarOpen) setSidebarOpen(true);
                                            toggleSubmenu(item.name);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                                            isSubActive(item.submenu) 
                                            ? 'text-secondary bg-blue-50 dark:bg-blue-900/20' 
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            {item.icon}
                                            {sidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                                        </div>
                                        {sidebarOpen && (
                                            isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                                        )}
                                    </button>

                                    {/* Submenu */}
                                    {sidebarOpen && isOpen && (
                                        <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 dark:border-gray-700 pl-2">
                                            {item.submenu.map(sub => (
                                                <Link
                                                    key={sub.path}
                                                    to={sub.path}
                                                    className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                                        isActive(sub.path)
                                                        ? 'bg-secondary text-white'
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                    }`}
                                                >
                                                    {sub.icon}
                                                    <span className="ml-2">{sub.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                             );
                         }

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${isActive(item.path)
                                        ? 'bg-secondary text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                {sidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                    
                    <div className="my-4 border-t border-gray-200 dark:border-gray-700 mx-2"></div>

                    {bottomNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-3 py-3 rounded-lg transition-colors ${isActive(item.path)
                                    ? 'bg-secondary text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {sidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-3 py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors ${!sidebarOpen && 'justify-center'}`}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                                    {user.fullName || user.username}
                                </span>
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.username || 'User'} 
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm">
                                        {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        )}
                    </div>
                    </div>
                </header>

                {/* Page Content */}
                <main ref={mainRef} className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors relative">
                    <Outlet />
                    <ScrollToTopButton containerRef={mainRef} />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
