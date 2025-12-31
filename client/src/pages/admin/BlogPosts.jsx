import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useToast } from '../../contexts/ToastContext';

const BlogPosts = () => {
    usePageTitle('Blog Posts');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { success, error } = useToast();

    const [postToDelete, setPostToDelete] = useState(null);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Filters & Search
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, mine, published, draft, private
    
    // Counts
    const [counts, setCounts] = useState({
        all: 0,
        mine: 0,
        published: 0,
        draft: 0,
        private: 0
    });

    // Sorting
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 20,
                search: debouncedSearch,
                sortBy: sortBy,
                order: sortOrder,
                status: statusFilter
            });

            const res = await fetch(`http://localhost:5001/api/blog/admin?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setTotalPages(data.totalPages);
                if (data.counts) {
                    setCounts(data.counts);
                }
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [currentPage, debouncedSearch, statusFilter, sortBy, sortOrder]);

    const handleDeleteClick = (id) => {
        setPostToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;
        
        try {
            const res = await fetch(`http://localhost:5001/api/blog/${postToDelete}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                success('Post deleted successfully');
                fetchPosts();
            } else {
                error('Failed to delete post');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            error('Error deleting post');
        } finally {
            setPostToDelete(null);
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle order if clicking same field
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new field, default to asc for text, desc for date usually, 
            // but simplified logic: new field starts as asc unless it's date-like, then desc easier for default?
            // Let's stick to simple: new field starts 'asc' except createdAt which we usually want desc.
            // For user friendliness: clicking title -> A-Z (asc). Clicking Date -> Newest (desc).
            
            if (field === 'createdAt') {
                 setSortBy(field);
                 setSortOrder('desc');
            } else {
                 setSortBy(field);
                 setSortOrder('asc');
            }
        }
    };

    const SortIcon = ({ field }) => {
        if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400 ml-1 inline-block opacity-0 group-hover:opacity-50 transition-opacity" />;
        return sortOrder === 'asc' 
            ? <ArrowUp className="w-4 h-4 text-secondary ml-1 inline-block" />
            : <ArrowDown className="w-4 h-4 text-secondary ml-1 inline-block" />;
    };

    // Helper to render Column Header
    const Th = ({ field, label, sortable = true }) => (
        <th 
            className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 group select-none transition-colors' : ''}`}
            onClick={() => sortable && handleSort(field)}
        >
            <div className="flex items-center">
                {label}
                {sortable && <SortIcon field={field} />}
            </div>
        </th>
    );

    // Filter Link Component
    const FilterLink = ({ status, label, count }) => (
        <button
            onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
            }}
            className={`text-sm font-medium transition-colors ${
                statusFilter === status 
                    ? 'text-secondary font-bold' 
                    : 'text-gray-500 hover:text-secondary dark:text-gray-400'
            }`}
        >
            {label}
            <span className="text-gray-400 ml-1">({count || 0})</span>
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
                <div className="flex items-center gap-3">
                     <Link 
                        to="/admin/blog/categories"
                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center shadow-sm"
                    >
                        <Filter className="w-4 h-4 mr-2" /> Categories
                    </Link>
                    <Link 
                        to="/admin/blog/tags"
                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center shadow-sm"
                    >
                       <Filter className="w-4 h-4 mr-2" /> Tags
                    </Link>
                    <Link 
                        to="/admin/blog/new"
                        className="px-4 py-2 bg-secondary hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5 mr-2" /> New Post
                    </Link>
                </div>
            </div>

            {/* Search Bar - Moved Above */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Links Bar */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                <FilterLink status="all" label="All" count={counts.all} />
                <span>|</span>
                <FilterLink status="mine" label="Mine" count={counts.mine} />
                <span>|</span>
                <FilterLink status="published" label="Published" count={counts.published} />
                <span>|</span>
                <FilterLink status="scheduled" label="Scheduled" count={counts.scheduled} />
                <span>|</span>
                <FilterLink status="draft" label="Drafts" count={counts.draft} />
                <span>|</span>
                <FilterLink status="private" label="Private" count={counts.private} />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <Th field="title" label="Title" />
                                <Th field="categories" label="Category" /> 
                                <Th field="published" label="Status" />
                                <Th field="createdAt" label="Date" />
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Loading posts...
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No posts found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{post.slug}</span>
                                                    {post.visibility === 'private' && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">Private</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-1 flex-wrap">
                                                {post.categories && post.categories.length > 0 ? (
                                                    post.categories.slice(0, 2).map((cat, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                            {cat}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Uncategorized</span>
                                                )}
                                                {post.categories && post.categories.length > 2 && (
                                                    <span className="text-xs text-gray-500">+{post.categories.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                post.published 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col">
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                {post.author && (
                                                    <span className="text-xs text-gray-400">{post.author.name}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2"> {/* Removed opacity/group-hover for always visible */}
                                                <Link 
                                                    to={`/blog/${post.slug}`} 
                                                    target="_blank"
                                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link 
                                                    to={`/admin/blog/edit/${post._id}`}
                                                    className="p-1 text-blue-400 hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteClick(post._id)}
                                                    className="p-1 text-red-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-secondary disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-secondary disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={!!postToDelete}
                onClose={() => setPostToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
};

export default BlogPosts;
