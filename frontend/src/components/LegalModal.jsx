import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, AlertTriangle } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, type }) => {
    const content = {
        privacy: {
            title: 'Privacy Policy',
            icon: <Shield className="text-green-500" />,
            text: [
                'We value your privacy. AnyDown does not store any personal data or download history on our servers.',
                'All download history is stored locally in your browser\'s storage and never leaves your device.',
                'We do not use tracking cookies or third-party analytics that identify you personally.',
                'Our backend only processes the video URL to provide download links and does not log your identity.'
            ]
        },
        terms: {
            title: 'Terms of Service',
            icon: <FileText className="text-blue-500" />,
            text: [
                'AnyDown is provided for personal, non-commercial use only.',
                'By using this service, you agree to respect the intellectual property rights of content creators.',
                'You are responsible for ensuring you have the legal right to download the content you provide.',
                'We do not host any video or audio content; we only provide a technical interface to public tools.'
            ]
        },
        disclaimer: {
            title: 'Disclaimer',
            icon: <AlertTriangle className="text-yellow-500" />,
            text: [
                'AnyDown is an independent project and is NOT affiliated with YouTube, Facebook, Instagram, or TikTok.',
                'The service is provided "as is" without any warranties of any kind.',
                'We are not responsible for any misuse of this tool or any copyright violations committed by users.',
                'Platform names and logos are trademarks of their respective owners.'
            ]
        }
    };

    const activeContent = content[type] || content.privacy;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/5">
                                        {activeContent.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold">{activeContent.title}</h2>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {activeContent.text.map((paragraph, i) => (
                                    <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                                <button 
                                    onClick={onClose}
                                    className="w-full btn-primary"
                                >
                                    I Understand
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LegalModal;
