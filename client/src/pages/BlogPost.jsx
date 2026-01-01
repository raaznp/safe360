import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, User, Share2, Twitter, Linkedin } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

const BlogPost = () => {
    const { slug } = useParams();
    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Destructure data safely
    const { post, related = [], next, previous } = postData || {};

    usePageTitle(post?.title);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/blog/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setPostData(data);
                } else {
                    setPostData(null);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    const shareUrl = window.location.href;
    const shareText = post?.title;

    const handleShare = (platform) => {
        let url = '';
        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            default:
                if (navigator.share) {
                    navigator.share({
                        title: shareText,
                        url: shareUrl
                    }).catch(console.error);
                    return;
                }
        }
        if (url) window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-primary pt-32 px-4 text-center transition-colors duration-300">
                <p className="text-gray-900 dark:text-white">Loading article...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-primary pt-32 px-4 text-center transition-colors duration-300">
                <h1 className="text-3xl text-gray-900 dark:text-white mb-4">Article Not Found</h1>
                <Link to="/blog" className="text-secondary hover:text-blue-700 dark:hover:text-white">Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-primary min-h-screen pt-20 pb-24 transition-colors duration-300">
            {/* Hero Image */}
            <div className="h-[400px] w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-primary to-transparent z-10 transition-colors duration-300" />
                <img src={post.image || 'https://via.placeholder.com/1200x600'} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl transition-colors duration-300"
                >
                    <Link to="/blog" className="inline-flex items-center text-accent hover:text-blue-700 dark:hover:text-white mb-8 transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags && post.tags.map(tag => (
                            <Link 
                                key={tag} 
                                to={`/blog?tag=${encodeURIComponent(tag)}`}
                                className="px-3 py-1 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white transition-colors text-secondary text-xs font-bold uppercase tracking-wider"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 dark:border-white/10 pb-8 mb-8 gap-4">
                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <Link to={`/blog?author=${encodeURIComponent(post.author || 'Safe360 Team')}`} className="flex items-center hover:text-secondary transition-colors">
                                <User className="h-4 w-4 mr-2" /> {post.author || 'Safe360 Team'}
                            </Link>
                            <span className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={() => handleShare('native')} className="text-gray-400 hover:text-secondary transition-colors"><Share2 className="w-5 h-5" /></button>
                            <button onClick={() => handleShare('twitter')} className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></button>
                            <button onClick={() => handleShare('linkedin')} className="text-gray-400 hover:text-blue-700 transition-colors"><Linkedin className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="prose prose-lg prose-gray dark:prose-invert max-w-none mb-16">
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 mb-16">
                        <div className="w-full md:w-auto">
                            {previous ? (
                                <Link to={`/blog/${previous.slug}`} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-secondary dark:hover:text-white transition-colors group">
                                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                                    <div className="text-left">
                                        <div className="text-xs text-gray-400">Previous Article</div>
                                        <div className="font-medium line-clamp-1 max-w-[200px]">{previous.title}</div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/blog" className="flex items-center text-gray-400 hover:text-gray-600">
                                    <ArrowLeft className="w-5 h-5 mr-3" /> Back to Blog
                                </Link>
                            )}
                        </div>
                        
                        <div className="w-full md:w-auto text-right">
                            {next && (
                                <Link to={`/blog/${next.slug}`} className="flex items-center justify-end text-gray-600 dark:text-gray-400 hover:text-secondary dark:hover:text-white transition-colors group">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400">Next Article</div>
                                        <div className="font-medium line-clamp-1 max-w-[200px]">{next.title}</div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Related Posts */}
                    {related.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-white/10 pt-12">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Articles</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                {related.map(item => (
                                    <Link key={item._id} to={`/blog/${item.slug}`} className="group">
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                                            <div className="h-32 overflow-hidden">
                                                <img src={item.image || 'https://via.placeholder.com/400x300'} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="p-4 flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                                                    {item.title}
                                                </h4>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    );
};

export default BlogPost;
