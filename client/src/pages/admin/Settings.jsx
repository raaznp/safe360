import { useState } from 'react';
import { Save, Globe, Mail, Bell, Shield, Lock } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

const Settings = () => {
    usePageTitle('Settings');
    const [activeTab, setActiveTab] = useState('general');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    // Placeholder settings state
    const [settings, setSettings] = useState({
        siteName: 'Safe360',
        supportEmail: 'support@safe360.com',
        maintenanceMode: false,
        emailNotifications: true,
        twoFactorAuth: true
    });

    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleSave = () => {
        setMessage('Settings saved (Simulation)');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (passwords.new !== passwords.confirm) {
            setError('New passwords do not match');
            return;
        }
        setMessage('Password updated successfully (Simulation).');
        setPasswords({ current: '', new: '', confirm: '' });
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden min-h-[500px] flex flex-col md:flex-row">
                
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <nav className="p-4 space-y-2">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === 'general' 
                                ? 'bg-secondary text-white' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Globe className="w-4 h-4 mr-3" />
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === 'notifications' 
                                ? 'bg-secondary text-white' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Bell className="w-4 h-4 mr-3" />
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === 'security' 
                                ? 'bg-secondary text-white' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Shield className="w-4 h-4 mr-3" />
                            Security
                        </button>
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="flex-1 p-8">
                    {activeTab === 'general' && (
                        <div className="max-w-xl space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Site Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Support Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Put the site in maintenance mode</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.maintenanceMode} 
                                        onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"></div>
                                </label>
                            </div>
                             <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button 
                                    onClick={handleSave}
                                    className="flex items-center px-6 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="max-w-xl space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
                             <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive emails about new messages and system alerts</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={settings.emailNotifications} 
                                        onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"></div>
                                </label>
                            </div>
                             <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button 
                                    onClick={handleSave}
                                    className="flex items-center px-6 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-xl space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Authentication</h2>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={settings.twoFactorAuth} 
                                            onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                    <Lock className="w-5 h-5 mr-2 text-secondary" />
                                    Change Password
                                </h2>
                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwords.current}
                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="submit" className="flex items-center px-4 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors">
                                            <Save className="w-4 h-4 mr-2" />
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

             {(message || error) && (
                <div className={`mt-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border-l-4 ${error ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                    <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-sm font-medium">{error || message}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
