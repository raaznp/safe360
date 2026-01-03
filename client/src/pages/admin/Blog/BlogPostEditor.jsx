import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Plus, X, Upload, FileText, Globe, Calendar, Trash2, Edit, Eye } from 'lucide-react';
import usePageTitle from '../../../hooks/usePageTitle';
import JoditEditor from 'jodit-react';
import MediaLibraryModal from '../../../components/MediaLibraryModal';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';

const BlogPostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    usePageTitle(isEditing ? 'Edit Post' : 'New Post');
    const editor = useRef(null);
    const token = localStorage.getItem('token');
    const { success, error, info } = useToast();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        metaDescription: '',
        content: '',
        image: '',
        categories: [],
        tags: [],
        published: false,
        visibility: 'public',
        publishedAt: '',
        commentsEnabled: true,
        imageAlt: '',
        author: ''
    });

    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    
    // Derived state for reading time (live preview)
    const readingTime = useMemo(() => {
        if (!formData.content) return 0;
        const text = formData.content.replace(/<[^>]*>/g, '');
        const wordCount = text.trim().split(/\s+/).length;
        return Math.ceil(wordCount / 200);
    }, [formData.content]);
    
    // ... existing state for sidebar data ...
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // ... new category/tag state ...
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newTag, setNewTag] = useState('');

    // Jodit Config
    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Start writing your amazing blog post...',
        height: 500,
        uploader: {
            insertImageAsBase64URI: true
        },
        toolbarAdaptive: false,
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'font', 'fontsize', 'brush', '|',
            'ul', 'ol', '|',
            'align', 'outdent', 'indent', '|',
            'link', 'image', 'video', 'table', '|',
            'hr', 'eraser', 'source', 'fullsize'
        ]
    }), []);

    useEffect(() => {
        fetchCategories();
        fetchTags();
        if (isEditing) {
            fetchPost();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/tags');
            const data = await res.json();
            setTags(data);
        } catch (err) {
            console.error('Failed to fetch tags', err);
        }
    };

    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Determine if admin by trying to fetch users? Or decode token?
                // /api/users is protected, usually admin only? 
                // Let's rely on the API response.
                const res = await fetch('/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                // If fails (e.g. 403), just don't show author selection
                console.log('Not authorized to fetch users or error');
            }
        };
        fetchUsers();
    }, []);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/blog/admin/post/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Handle legacy single category
                let postCategories = data.categories || [];
                if (!postCategories.length && data.category) {
                    postCategories = [data.category];
                }

                setFormData({
                    title: data.title,
                    slug: data.slug,
                    metaDescription: data.metaDescription || '',
                    content: data.content,
                    image: data.image,
                    categories: postCategories,
                    tags: data.tags || [],
                    published: data.published,
                    visibility: data.visibility || 'public',
                    publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : '',
                    commentsEnabled: data.commentsEnabled !== undefined ? data.commentsEnabled : true,
                    author: (data.author && typeof data.author === 'object') ? data.author._id : (data.author || '')
                });
            } else {
                console.error('Failed to fetch post');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };



    const handleCategoryToggle = (catName) => {
        setFormData(prev => {
            const newCategories = prev.categories.includes(catName)
                ? prev.categories.filter(c => c !== catName)
                : [...prev.categories, catName];
            return { ...formData, categories: newCategories };
        });
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategory, description: 'Created from Post Editor' })
            });
            if (res.ok) {
                const data = await res.json();
                setCategories([...categories, data]);
                // Automatically select the new category
                setFormData(prev => ({
                    ...prev,
                    categories: [...prev.categories, data.name]
                }));
                setNewCategory('');
                setShowNewCategoryInput(false);
            }
        } catch (err) {
            console.error('Failed to create category', err);
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(newTag.trim())) {
                setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleSubmit = async (shouldPublish) => {
        setLoading(true);
        try {
            const url = isEditing 
                ? `/api/blog/${id}`
                : '/api/blog';
            
            const method = isEditing ? 'PUT' : 'POST';

            const payload = { ...formData, published: shouldPublish };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload) // Send array of categories
            });

            if (res.ok) {
                // Update local state to reflect new published status if staying on page
                setFormData(prev => ({ ...prev, published: shouldPublish }));
                if (!isEditing) {
                   navigate('/admin/blog');
                   success('Post created successfully!');
                } else {
                     success('Post updated successfully!');
                }
            } else {
                const errorData = await res.json();
                error(`Error: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error saving post:', err);
            error('An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = () => {
        if (!isEditing) return;
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                success('Post moved to trash');
                navigate('/admin/blog');
            } else {
                error('Failed to delete post');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            error('Error deleting post');
        }
    };

    const handlePreview = () => {
        if (formData.slug) {
            window.open(`/blog/${formData.slug}`, '_blank');
        } else {
            info('Please add a slug to preview.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin/blog')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Edit Post' : 'Add New Post'}
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-gray-900 dark:text-white"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-gray-900 dark:text-white font-mono text-sm"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Meta Description
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-gray-900 dark:text-white h-24 resize-none"
                                    value={formData.metaDescription}
                                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                    maxLength={160}
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">
                                    {formData.metaDescription.length}/160
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Content
                            </label>
                             <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                Read Time: ~{readingTime} min
                             </div>
                        </div>
                        <div className="prose-editor text-black">
                             <JoditEditor
                                ref={editor}
                                value={formData.content}
                                config={config}
                                onBlur={newContent => setFormData({ ...formData, content: newContent })}
                            />
                        </div>
                    </div>

                    {/* SEO Preview */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Rank High on Search Engines (SEO Preview)
                        </label>
                        <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow max-w-2xl">
                             {/* Google-like Preview */}
                             <div className="flex flex-col gap-1">
                                 <div className="flex items-center gap-2 mb-1">
                                     <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center p-1">
                                         <img src="/logo.png" alt="" className="w-full h-full object-contain opacity-50" onError={(e) => e.target.style.display = 'none'} />
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-sm text-gray-800 font-medium">Safe360</span>
                                         <span className="text-xs text-gray-500">https://safe360.com/blog/{formData.slug || 'your-post-slug'}</span>
                                     </div>
                                 </div>
                                 <a href="#" className="text-xl text-[#1a0dab] hover:underline font-medium break-words leading-tight">
                                     {formData.title || 'Your Post Title'}
                                 </a>
                                 <div className="text-sm text-[#4d5156] leading-relaxed line-clamp-2">
                                     {formData.metaDescription || formData.content?.replace(/<[^>]*>/g, '').slice(0, 160) || 'Please enter a meta description to see how your post will look in search engine results.'} ...
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Image - Moved to Sidebar below Tags ??? User said "below tags options". Tags are in sidebar. */ }
                    
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Actions Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Publish</h3>
                        </div>
                        <div className="p-4 space-y-4">
                             <div className="flex gap-2">
                                <button
                                    onClick={() => handleSubmit(false)}
                                    disabled={loading}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary shadow-sm transition-colors"
                                >
                                    Save Draft
                                </button>
                                <button
                                    onClick={handlePreview}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary shadow-sm transition-colors"
                                >
                                    Preview
                                </button>
                             </div>



                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Visibility</label>
                                    <div className="flex gap-3">
                                        <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                                            <input 
                                                type="radio" 
                                                name="visibility" 
                                                value="public"
                                                checked={formData.visibility === 'public'}
                                                onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                                                className="mr-1.5 text-secondary focus:ring-secondary"
                                            />
                                            Public
                                        </label>
                                        <label className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                                            <input 
                                                type="radio" 
                                                name="visibility" 
                                                value="private"
                                                checked={formData.visibility === 'private'}
                                                onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                                                className="mr-1.5 text-secondary focus:ring-secondary"
                                            />
                                            Private
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between gap-2">
                                     <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish At</label>
                                     <div className="relative flex-1 max-w-[180px]">
                                         <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                         <input 
                                            type="datetime-local" 
                                            className="w-full pl-8 pr-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-gray-900 dark:text-white"
                                            value={formData.publishedAt}
                                            onChange={(e) => setFormData({...formData, publishedAt: e.target.value})}
                                         />
                                     </div>
                                </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                             {isEditing ? (
                                <button 
                                    onClick={handleDeleteClick}
                                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                                >
                                    Move to Trash
                                </button>
                             ) : (
                                <div></div> // Spacer
                             )}
                            <button
                                onClick={() => handleSubmit(true)}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-blue-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
                            >
                                {loading ? 'Processing...' : (
                                    formData.publishedAt && new Date(formData.publishedAt) > new Date() ? 'Schedule' : (isEditing ? 'Update' : 'Publish')
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                           {categories.map((category) => (
                                <label key={category._id} className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center pt-0.5">
                                        <input
                                            type="checkbox"
                                            name="categories"
                                            className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                            checked={formData.categories.includes(category.name)}
                                            onChange={() => handleCategoryToggle(category.name)}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                        {category.name}
                                    </span>
                                </label>
                           ))}
                        </div>
                         
                        {showNewCategoryInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="New category name"
                                    className="flex-1 px-3 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-gray-900 dark:text-white"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                    autoFocus
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="px-3 py-1 bg-secondary text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        ) : (
                             <button
                                onClick={() => setShowNewCategoryInput(true)}
                                className="text-sm text-secondary hover:underline flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add New Category
                            </button>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                         <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 group"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-white transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Add tags and hit Enter"
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-gray-900 dark:text-white text-sm"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                            />
                            <div className="text-xs text-gray-500">
                                Separate tags with commas or hit Enter
                            </div>
                         </div>
                    </div>

                    {/* Image - Moved to Sidebar */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Featured Image
                        </label>
                        <div 
                            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative"
                            onClick={() => setIsMediaModalOpen(true)}
                        >
                            {formData.image ? (
                                <div className="relative group">
                                    <img 
                                        src={formData.image} 
                                        alt={formData.imageAlt || 'Featured'} 
                                        className="max-h-32 mx-auto rounded-lg shadow-sm w-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                        <p className="text-white text-sm font-medium">Click to change</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData({ ...formData, image: '', imageAlt: '' });
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto text-gray-400">
                                        <ImageIcon className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        <span className="text-secondary font-medium">Set featured image</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {formData.image && (
                           <div className="mt-3">
                               <label className="block text-xs font-medium text-gray-500 mb-1">Alt Text</label>
                               <input 
                                   type="text" 
                                   className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-1 focus:ring-secondary"
                                   placeholder="Describe image for SEO"
                                   value={formData.imageAlt}
                                   onChange={(e) => setFormData({...formData, imageAlt: e.target.value})}
                               />
                               <p className="text-[10px] text-gray-400 mt-1">Default is taken from media library.</p>
                           </div>
                        )}
                    </div>

                    {/* Author Selection (Moved to Bottom) */}
                    {users.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Author</h3>
                            <div>
                                <select
                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary outline-none text-gray-900 dark:text-white"
                                    value={String(formData.author || '')}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                >
                                    <option value="" disabled>Select Author</option>
                                    {users.map(user => (
                                        <option key={user._id} value={String(user._id)}>
                                            {user.fullName || user.username} ({user.username})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-2">
                                    Admins can reassign authorship.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <MediaLibraryModal 
                isOpen={isMediaModalOpen} 
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={(media) => {
                    setFormData({
                        ...formData,
                        image: media.url,
                        imageAlt: media.altText || ''
                    });
                }}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message="Are you sure you want to move this post to the trash? This action cannot be undone."
                confirmText="Move to Trash"
                isDestructive={true}
            />
        </div>
    );
};

export default BlogPostEditor;
