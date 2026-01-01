import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Shield, User } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

const Users = () => {
    usePageTitle('User Management');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'editor' });
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId
            ? `http://localhost:5001/api/users/${editingId}`
            : 'http://localhost:5001/api/users';

        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({ username: '', email: '', password: '', role: 'editor' });
                setEditingId(null);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await fetch(`http://localhost:5001/api/users/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const openEdit = (user) => {
        setFormData({ username: user.username, email: user.email, password: '', role: user.role, fullName: user.fullName || '' });
        setEditingId(user._id);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ username: '', email: '', password: '', role: 'editor', fullName: '' });
                        setShowModal(true);
                    }}
                    className="flex items-center px-4 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add User
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm dark:shadow-none transition-colors">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-sm uppercase transition-colors">
                        <tr>
                            <th className="px-6 py-4 font-medium">Username</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Post Count</th>
                            <th className="px-6 py-4 font-medium">Created At</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-gray-900 dark:text-white font-medium">
                                        <div className="w-8 h-8 rounded-full bg-secondary/10 dark:bg-gray-700 flex items-center justify-center mr-3">
                                            <User className="w-4 h-4 text-secondary dark:text-gray-400" />
                                        </div>
                                        {user.username}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                                        }`}>
                                        <Shield className="w-3 h-3 mr-1" />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">{user.postCount || 0}</span>
                                        <span className="text-xs text-gray-400">posts</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => openEdit(user)}
                                        className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md shadow-2xl transition-colors">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {editingId ? 'Edit User' : 'Add New User'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                    Password {editingId && <span className="text-xs text-gray-500">(Leave blank to keep current)</span>}
                                </label>
                                <input
                                    type="password"
                                    required={!editingId}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Role</label>
                                <select
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none transition-colors"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    {editingId ? 'Update User' : 'Add New User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
