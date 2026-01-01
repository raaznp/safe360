import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

const Blog = () => {
    usePageTitle('Blog');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState({ currentPage: 1, totalPages: 1, totalPosts: 0 });
    
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    
    const page = parseInt(queryParams.get('page')) || 1;
    const tag = queryParams.get('tag') || '';
    const author = queryParams.get('author') || '';

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                let url = `/api/blog?page=${page}&limit=12`;
                if (tag) url += `&tag=${encodeURIComponent(tag)}`;
                if (author) url += `&author=${encodeURIComponent(author)}`;

                const res = await fetch(url);
                const data = await res.json();
                
                // Backend now returns { posts, currentPage, totalPages, totalPosts }
                // Use fallback for old ID-based response structure if needed during transition, 
                // though we just updated backend to return object.
                if (data.posts) {
                    setPosts(data.posts);
                    setMetadata({
                        currentPage: data.currentPage,
                        totalPages: data.totalPages,
                        totalPosts: data.totalPosts
                    });
                } else {
                    // Fallback if backend update is not live or sends array
                    setPosts(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [page, tag, author]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > metadata.totalPages) return;
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        navigate(`?${params.toString()}`);
        window.scrollTo(0, 0);
    };

    const clearFilter = (key) => {
        const params = new URLSearchParams(location.search);
        params.delete(key);
        params.set('page', 1); // Reset to page 1
        navigate(`?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-primary pt-32 px-4 text-center transition-colors duration-300">
                <p className="text-gray-900 dark:text-white">Loading articles...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-primary min-h-screen pt-20 transition-colors duration-300">
            <section className="py-20 text-center bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Industry <span className="text-secondary">Insights</span></h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
                    Latest news, trends, and thoughts from the Safe360 team.
                </p>
                
                {/* Active Filters */}
                {(tag || author) && (
                    <div className="mt-8 flex justify-center gap-4">
                        {tag && (
                            <div className="flex items-center bg-secondary text-white px-4 py-2 rounded-full text-sm">
                                <Tag className="w-4 h-4 mr-2" />
                                {tag}
                                <button onClick={() => clearFilter('tag')} className="ml-2 hover:text-gray-200">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {author && (
                            <div className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-full text-sm">
                                <User className="w-4 h-4 mr-2" />
                                {author}
                                <button onClick={() => clearFilter('author')} className="ml-2 hover:text-gray-200">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 border-t border-gray-100 dark:border-white/5 pt-12">
                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                        No articles found matching your criteria.
                        {(tag || author) && (
                            <div className="mt-4">
                                <Link to="/blog" className="text-secondary hover:underline">Clear all filters</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-xl dark:hover:border-secondary/50 transition-all group flex flex-col"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={post.image || 'https://via.placeholder.com/400x300'}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4 space-x-4">
                                            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                            <Link to={`/blog?author=${encodeURIComponent(post.author || 'Safe360 Team')}`} className="flex items-center hover:text-secondary transition-colors">
                                                <User className="h-3 w-3 mr-1" /> {post.author || 'Safe360 Team'}
                                            </Link>
                                        </div>
                                        <Link to={`/blog/${post.slug}`}>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                                            {post.content}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags && post.tags.slice(0, 2).map(t => (
                                                    <Link 
                                                        key={t} 
                                                        to={`/blog?tag=${encodeURIComponent(t)}`}
                                                        className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 flex items-center hover:bg-secondary hover:text-white transition-colors"
                                                    >
                                                        <Tag className="h-3 w-3 mr-1" /> {t}
                                                    </Link>
                                                ))}
                                            </div>
                                            <Link to={`/blog/${post.slug}`} className="text-secondary hover:text-blue-700 dark:hover:text-white transition-colors flex items-center text-sm font-medium">
                                                Read More <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {metadata.totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(metadata.currentPage - 1)}
                                    disabled={metadata.currentPage === 1}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                {Array.from({ length: metadata.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                                            metadata.currentPage === pageNum
                                                ? 'bg-secondary text-white'
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(metadata.currentPage + 1)}
                                    disabled={metadata.currentPage === metadata.totalPages}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary hover:text-white transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Blog;
