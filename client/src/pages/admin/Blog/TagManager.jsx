import { useState, useEffect } from 'react';
import { Plus, Trash, Edit } from 'lucide-react';
import usePageTitle from '../../../hooks/usePageTitle';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';

const TagManager = () => {
    usePageTitle('Tag Management');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });

    const { success, error } = useToast();
    const [deleteId, setDeleteId] = useState(null);

    const token = localStorage.getItem('token');

    const fetchTags = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tags', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', slug: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (tag) => {
        setFormData({ name: tag.name, slug: tag.slug });
        setEditId(tag._id);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        // Auto-generate slug if empty
        const slugToSubmit = formData.slug.trim() 
            ? formData.slug 
            : formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const url = isEditing 
            ? `/api/tags/${editId}` 
            : '/api/tags';
        
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: formData.name, slug: slugToSubmit })
            });

            if (res.ok) {
                resetForm();
                fetchTags();
                success(isEditing ? 'Tag updated' : 'Tag created');
            } else {
                error('Failed to save tag');
            }
        } catch (err) {
            console.error('Error saving tag:', err);
            error('Error saving tag');
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/tags/${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                if (isEditing && editId === deleteId) resetForm(); 
                fetchTags();
                success('Tag deleted');
            } else {
                error('Failed to delete tag');
            }
        } catch (err) {
            console.error('Error deleting tag:', err);
            error('Error deleting tag');
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Tags</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {isEditing ? 'Edit Tag' : 'Add New Tag'}
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Tag Name"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="tag-slug"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none font-mono text-sm"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="flex-1 md:flex-none px-6 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center whitespace-nowrap"
                        >
                            {isEditing ? <Edit className="w-4 h-4 mr-2 text-white" /> : <Plus className="w-4 h-4 mr-2" />}
                            {isEditing ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="3" className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : tags.length === 0 ? (
                            <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No tags found.</td></tr>
                        ) : (
                            tags.map(tag => (
                                <tr key={tag._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{tag.name}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-sm">{tag.slug}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(tag)}
                                                className="p-1.5 text-gray-400 hover:text-secondary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(tag._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

             <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Tag"
                message="Are you sure you want to delete this tag?"
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
};

export default TagManager;
