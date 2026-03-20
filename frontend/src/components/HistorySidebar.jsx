import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, X, Download, PlayCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const HistorySidebar = ({ isOpen, onClose }) => {
    const { history, clearHistory } = useAppContext();

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: isOpen ? 0 : '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-background-light dark:bg-background-dark border-l border-gray-200 dark:border-white/10 shadow-2xl z-[70] overflow-hidden"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-primary" />
                            <h2 className="text-xl font-bold">Download History</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {history.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <Clock size={48} className="mb-4" />
                                <p>No recent downloads found.</p>
                                <p className="text-sm">Your history will appear here.</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <div 
                                    key={item.id}
                                    className="glass-card p-3 flex gap-4 group hover:border-primary/30 transition-all"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black shrink-0 relative">
                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-70" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between overflow-hidden">
                                        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                            <span className="bg-white/5 px-1.5 py-0.5 rounded">{item.platform}</span>
                                            <span>{item.format}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {history.length > 0 && (
                        <div className="p-6 border-t border-gray-200 dark:border-white/10">
                            <button
                                onClick={clearHistory}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-all"
                            >
                                <Trash2 size={18} />
                                Clear History
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default HistorySidebar;
