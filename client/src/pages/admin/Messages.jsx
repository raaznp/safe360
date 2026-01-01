import { useState, useEffect } from 'react';
import { Mail, Calendar, Trash } from 'lucide-react';
import usePageTitle from '../../hooks/usePageTitle';

const Messages = () => {
    usePageTitle('Messages');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/contact', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Since there is no DELETE endpoint in the backend code I saw earlier, 
    // I will just implement the view part. If I need to delete, I'd need to add that route to server.
    // However, for "completion" a view is sufficient as per plan. 
    // Actually, I should probably check if I can add a delete endpoint easily, 
    // but the plan didn't explicitly say "Delete Messages", just "View".
    // I'll stick to View to avoid scope creep, but I'll add the button just in case the backend supports it later or I add it.
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Messages</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm dark:shadow-none transition-colors">
                {loading ? (
                    <div className="p-8 text-center text-gray-600 dark:text-gray-400">Loading messages...</div>
                ) : messages.length === 0 ? (
                     <div className="p-8 text-center text-gray-600 dark:text-gray-400">No messages found.</div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {messages.map((msg) => (
                            <div key={msg._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Mail className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{msg.firstName} {msg.lastName}</h3>
                                            <p className="text-sm text-blue-600 dark:text-blue-400">{msg.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-500 flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 ml-12 mt-2 leading-relaxed">
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
