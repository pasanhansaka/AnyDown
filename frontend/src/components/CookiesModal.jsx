import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Info, Check, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const CookiesModal = ({ isOpen, onClose }) => {
    const { ytCookies, setYtCookies } = useAppContext();
    const [tempCookies, setTempCookies] = useState('');

    // Load cookies when modal is opened
    useEffect(() => {
        if (isOpen) {
            setTempCookies(ytCookies || '');
        }
    }, [isOpen, ytCookies]);

    const handleSave = () => {
        setYtCookies(tempCookies);
        toast.success('Cookies updated successfully!');
        onClose();
    };

    const handleClear = () => {
        setTempCookies('');
        setYtCookies('');
        toast.success('Cookies cleared!');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Body */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
                    >
                        <div className="p-6 sm:p-8">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <Key size={20} />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold">YouTube Cookies Settings</h2>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Alert/Info */}
                            <div className="flex gap-3 p-4 rounded-2xl bg-primary/5 text-slate-600 dark:text-slate-300 border border-primary/20 mb-6 text-sm">
                                <Info className="text-primary shrink-0 mt-0.5" size={18} />
                                <div className="space-y-1">
                                    <h4 className="font-bold">Why is this needed?</h4>
                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        YouTube restricts video downloads from cloud hosting servers. By passing your browser's cookies, YouTube recognizes the request as a normal user visit, bypassing bot checks and unlocking age-restricted or private downloads.
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        Paste Cookies (Netscape format / cookies.txt)
                                    </label>
                                    <a 
                                        href="https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        How to get this?
                                    </a>
                                </div>
                                <textarea
                                    value={tempCookies}
                                    onChange={(e) => setTempCookies(e.target.value)}
                                    placeholder="# Netscape HTTP Cookie File&#10;.youtube.com&#9;TRUE&#9;/&#9;TRUE&#9;1738234823&#9;SID&#9;abc123xyz...&#10;# Paste your exported cookies file content here..."
                                    className="w-full h-44 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-xs resize-none placeholder:text-slate-500"
                                />
                            </div>

                            {/* Help guide links */}
                            <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                                💡 **Tip:** Install the Chrome/Firefox extension **"Get cookies.txt LOCALLY"**, go to YouTube, click the extension icon to export your cookies, copy the text content, and paste it here.
                            </div>

                            {/* Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex gap-3 flex-wrap">
                                {ytCookies && (
                                    <button 
                                        onClick={handleClear}
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all text-sm shrink-0 border border-red-500/20"
                                        title="Clear Cookies"
                                    >
                                        <Trash2 size={16} />
                                        Clear Cookies
                                    </button>
                                )}
                                <button 
                                    onClick={handleSave}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-primary-light text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-primary/20"
                                >
                                    <Check size={16} />
                                    Save & Apply Settings
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CookiesModal;
