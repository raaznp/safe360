import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const Toast = ({ id, type, message, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    };

    const styles = {
        success: 'bg-white dark:bg-gray-800 border-l-4 border-green-500',
        error: 'bg-white dark:bg-gray-800 border-l-4 border-red-500',
        info: 'bg-white dark:bg-gray-800 border-l-4 border-blue-500',
        warning: 'bg-white dark:bg-gray-800 border-l-4 border-yellow-500'
    };

    return (
        <div 
            className={`flex items-start p-4 rounded-lg shadow-lg mb-3 w-80 transform transition-all duration-300 ease-in-out hover:scale-105 ${styles[type] || styles.info}`}
        >
            <div className="flex-shrink-0 mr-3">
                {icons[type] || icons.info}
            </div>
            <div className="flex-1 mr-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {message}
                </p>
            </div>
            <button 
                onClick={() => onClose(id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = (msg, duration) => addToast(msg, 'success', duration);
    const error = (msg, duration) => addToast(msg, 'error', duration);
    const info = (msg, duration) => addToast(msg, 'info', duration);
    const warning = (msg, duration) => addToast(msg, 'warning', duration);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end pointer-events-none">
                <div className="pointer-events-auto">
                    {toasts.map(toast => (
                        <Toast 
                            key={toast.id} 
                            {...toast} 
                            onClose={removeToast} 
                        />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
