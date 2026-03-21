import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const ContactModal = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const email = 'thornsolution@gmail.com';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/10">
                                        <Mail className="text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Contact Us</h2>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <p className="text-slate-600 dark:text-slate-400">
                                    Have a question, feedback, or a business inquiry? Reach out to us directly!
                                </p>
                                
                                <div className="group relative flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-slate-400" />
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{email}</span>
                                    </div>
                                    <button 
                                        onClick={copyToClipboard}
                                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg shadow-sm transition-all"
                                        title="Copy Email"
                                    >
                                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-primary" />}
                                    </button>
                                </div>
                                
                                <p className="text-xs text-center text-slate-500 uppercase tracking-widest">
                                    Typically responds within 24-48 hours
                                </p>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                                <a 
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    <Mail size={18} />
                                    Send Email Now
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
