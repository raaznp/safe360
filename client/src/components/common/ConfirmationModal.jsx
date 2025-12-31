import React from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm Action', 
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
            <div className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    {isDestructive && (
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                    )}
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        {!isDestructive && (
                             <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">
                                {title}
                            </h3>
                        )}
                        {isDestructive && (
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                {title}
                            </h3>
                        )}
                        
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                        isDestructive 
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                        : 'bg-secondary hover:bg-blue-600 focus:ring-secondary'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    {confirmText}
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={onClose}
                >
                    {cancelText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
