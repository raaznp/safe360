import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Upload, X, Save, MoreVertical } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';

const TeamManager = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const { success, error } = useToast();
    const token = localStorage.getItem('token');

    // Form State
    const [formData, setFormData] = useState({
        name: '', role: '', bio: '', image: null,
        linkedin: '', twitter: '', email: '',
        active: true, order: 0
    });
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/team/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            error('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                bio: member.bio || '',
                image: null, // Don't preload file object
                linkedin: member.social?.linkedin || '',
                twitter: member.social?.twitter || '',
                email: member.social?.email || '',
                active: member.active,
                order: member.order
            });
            setPreviewUrl(member.image || '');
        } else {
            setEditingMember(null);
            setFormData({
                name: '', role: '', bio: '', image: null,
                linkedin: '', twitter: '', email: '',
                active: true, order: 0
            });
            setPreviewUrl('');
        }
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('role', formData.role);
        data.append('bio', formData.bio);
        data.append('active', formData.active);
        data.append('order', formData.order);
        data.append('social', JSON.stringify({
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            email: formData.email
        }));
        if (formData.image) data.append('image', formData.image);

        try {
            const url = editingMember 
                ? `http://localhost:5001/api/team/${editingMember._id}`
                : 'http://localhost:5001/api/team';
            
            const method = editingMember ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` }, // Content-Type auto-set for FormData
                body: data
            });

            if (res.ok) {
                success(editingMember ? 'Member updated' : 'Member added');
                setShowModal(false);
                fetchMembers();
            } else {
                throw new Error('Failed to save');
            }
        } catch (err) {
            error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this team member?')) return;
        try {
            await fetch(`http://localhost:5001/api/team/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            success('Member removed');
            fetchMembers();
        } catch (err) {
            error('Failed to remove member');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your team profiles.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map(member => (
                    <div key={member._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group">
                        <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                             {member.image ? (
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                             )}
                             <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(member)} className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-sm">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(member._id)} className="p-2 bg-white/90 hover:bg-red-50 text-red-500 rounded-lg shadow-sm">
                                    <Trash className="w-4 h-4" />
                                </button>
                             </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{member.name}</h3>
                                    <p className="text-secondary text-sm font-medium">{member.role}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${member.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {member.active ? 'Active' : 'Hidden'}
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{member.bio}</p>
                            <div className="text-xs text-gray-400">Order: {member.order}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingMember ? 'Edit Profile' : 'New Team Member'}
                            </h2>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="flex gap-6">
                                <div className="w-1/3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Profile Image</label>
                                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 group hover:border-secondary transition-colors">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <Upload className="w-8 h-8 mb-2" />
                                                <span className="text-xs">Upload</span>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                    </div>
                                </div>
                                <div className="w-2/3 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Name</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Role</label>
                                        <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Bio</label>
                                <textarea rows="3" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">LinkedIn URL</label>
                                    <input type="text" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Twitter URL</label>
                                    <input type="text" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded text-secondary focus:ring-secondary" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Active</span>
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Order:</span>
                                        <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded dark:text-white" />
                                    </div>
                                </div>
                                <button type="submit" className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    Save Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManager;
