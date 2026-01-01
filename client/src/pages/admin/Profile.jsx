import { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, GraduationCap, Briefcase, Plus, Trash, MapPin, Phone, Github, Linkedin, Twitter, Globe, Camera } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import MediaLibraryModal from '../../components/MediaLibraryModal';

import { useToast } from '../../contexts/ToastContext';

const Profile = () => {
    usePageTitle('My Profile');
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(true);
    const { success, error, info } = useToast();

    const [profile, setProfile] = useState({
        username: '',
        email: '',
        role: '',
        fullName: '',
        phone: '',
        address: '',
        bio: '',
        avatar: '',
        socials: {
            linkedin: '',
            github: '',
            twitter: '',
            website: ''
        }
    });

    const [education, setEducation] = useState([]);
    const [workHistory, setWorkHistory] = useState([]);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok) {
                setProfile({
                   ...data,
                   avatar: data.avatar || '',
                   socials: data.socials || { linkedin: '', github: '', twitter: '', website: '' }
                });
                setEducation(data.education || []);
                setWorkHistory(data.workHistory || []);
            } else {
                error(data.message || 'Failed to load profile');
            }
        } catch (err) {
            error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleMediaSelect = (image) => {
        setProfile(prev => ({ ...prev, avatar: image.url }));
        info('Profile picture selected. Click Save to apply.');
    };

    const handleUpdateProfile = async (e) => {
        if (e) e.preventDefault();

        const cleanedEducation = education.map(({ _id, ...rest }) => rest);
        const cleanedWorkHistory = workHistory.map(({ _id, ...rest }) => rest);

        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: profile.fullName,
                    phone: profile.phone,
                    address: profile.address,
                    bio: profile.bio,
                    avatar: profile.avatar,
                    socials: profile.socials,
                    education: cleanedEducation,
                    workHistory: cleanedWorkHistory
                })
            });

            const data = await res.json();

            if (res.ok) {
                success('Profile updated successfully');
            } else {
                error(data.message || 'Update failed');
            }
        } catch (err) {
            error('Server error');
        }
    };

    // --- Education Handlers ---
    const handleEducationChange = (index, field, value) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    const handleAddEducation = () => {
        setEducation([...education, { school: '', degree: '', year: '' }]);
    };

    const handleDeleteEducation = (index) => {
        const updated = education.filter((_, i) => i !== index);
        setEducation(updated);
    };

    // --- Work History Handlers ---
    const handleWorkChange = (index, field, value) => {
        const updated = [...workHistory];
        updated[index][field] = value;
        setWorkHistory(updated);
    };

    const handleAddWork = () => {
        setWorkHistory([...workHistory, { company: '', role: '', location: '', duration: '', description: '' }]);
    };

    const handleDeleteWork = (index) => {
        const updated = workHistory.filter((_, i) => i !== index);
        setWorkHistory(updated);
    };


    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px] flex flex-col">
                {/* Tabs Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto bg-gray-50/50 dark:bg-gray-900/50">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 flex items-center ${
                            activeTab === 'personal'
                                ? 'border-secondary text-secondary bg-white dark:bg-gray-800'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Personal Details
                    </button>
                    <button
                        onClick={() => setActiveTab('education')}
                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 flex items-center ${
                            activeTab === 'education'
                                ? 'border-secondary text-secondary bg-white dark:bg-gray-800'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Education
                    </button>
                    <button
                        onClick={() => setActiveTab('work')}
                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 flex items-center ${
                            activeTab === 'work'
                                ? 'border-secondary text-secondary bg-white dark:bg-gray-800'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Work History
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-8 flex-1">
                    {activeTab === 'personal' && (
                        <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-4xl mx-auto">
                            
                            {/* Profile Picture Section */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden relative group">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <User className="w-16 h-16" />
                                        </div>
                                    )}
                                    <button 
                                        type="button"
                                        onClick={() => setIsLibraryOpen(true)}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none outline-none"
                                    >
                                        <Camera className="w-8 h-8 text-white" />
                                    </button>
                                </div>


                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={profile.address}
                                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Role</label>
                                    <input
                                        type="text"
                                        value={profile.role}
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed capitalize"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Bio</label>
                                <textarea
                                    rows="4"
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            {/* Social Media Section */}
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Profiles</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={profile.socials?.linkedin || ''}
                                            onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                            placeholder="LinkedIn URL"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={profile.socials?.github || ''}
                                            onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, github: e.target.value } })}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                            placeholder="GitHub URL"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={profile.socials?.twitter || ''}
                                            onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, twitter: e.target.value } })}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                            placeholder="Twitter URL"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={profile.socials?.website || ''}
                                            onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, website: e.target.value } })}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                            placeholder="Personal Website URL"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="flex items-center px-6 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg shadow-secondary/20">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'education' && (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education History</h3>
                                <button 
                                    onClick={handleAddEducation}
                                    className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New
                                </button>
                            </div>
                            
                            {education.length === 0 && <p className="text-gray-500 text-center py-8">No education history added.</p>}

                            {education.map((item, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                                    <button 
                                        onClick={() => handleDeleteEducation(index)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Remove"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">School / University</label>
                                            <input
                                                type="text"
                                                value={item.school}
                                                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                                placeholder="Institution Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Degree</label>
                                            <input
                                                type="text"
                                                value={item.degree}
                                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                                placeholder="Degree / Certificate"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Year / Duration</label>
                                            <input
                                                type="text"
                                                value={item.year}
                                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                                placeholder="e.g. 2015 - 2019"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                             {education.length > 0 && (
                                <div className="flex justify-end pt-4">
                                    <button onClick={handleUpdateProfile} className="flex items-center px-6 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Education
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'work' && (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h3>
                                <button 
                                    onClick={handleAddWork}
                                    className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New
                                </button>
                            </div>

                             {workHistory.length === 0 && <p className="text-gray-500 text-center py-8">No work history added.</p>}

                            {workHistory.map((item, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                                    <button 
                                        onClick={() => handleDeleteWork(index)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="Remove"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Company</label>
                                            <input
                                                type="text"
                                                value={item.company}
                                                onChange={(e) => handleWorkChange(index, 'company', e.target.value)}
                                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role / Title</label>
                                            <input
                                                type="text"
                                                value={item.role}
                                                onChange={(e) => handleWorkChange(index, 'role', e.target.value)}
                                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                                placeholder="Job Title"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-3 w-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={item.location || ''}
                                                    onChange={(e) => handleWorkChange(index, 'location', e.target.value)}
                                                    className="w-full mt-1 pl-8 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duration</label>
                                            <input
                                                type="text"
                                                value={item.duration}
                                                onChange={(e) => handleWorkChange(index, 'duration', e.target.value)}
                                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                                                placeholder="e.g. Jan 2020 - Present"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</label>
                                            <textarea
                                                rows="2"
                                                value={item.description}
                                                onChange={(e) => handleWorkChange(index, 'description', e.target.value)}
                                                className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none resize-none"
                                                placeholder="Key responsibilities and achievements..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {workHistory.length > 0 && (
                                <div className="flex justify-end pt-4">
                                    <button onClick={handleUpdateProfile} className="flex items-center px-6 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Work History
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <MediaLibraryModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={handleMediaSelect}
            />
        </div>
    );
};

export default Profile;
