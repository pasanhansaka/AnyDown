import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ResultCard from '../components/ResultCard';
import HistorySidebar from '../components/HistorySidebar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import { History, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const { loading, videoData, error } = useAppContext();
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors">
            <Navbar />
            
            <main className="relative">
                <Hero />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="text-primary animate-pulse" size={32} />
                                    </div>
                                </div>
                                <h2 className="mt-6 text-xl font-bold italic animate-pulse">Analyzing Link...</h2>
                                <p className="text-sm text-gray-500 mt-2">Connecting to proxy servers</p>
                            </motion.div>
                        ) : videoData ? (
                            <ResultCard key="result" />
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-md mx-auto p-6 glass-card border-red-500/20 text-center"
                            >
                                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Info size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Extraction Failed</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{error}</p>
                                <button 
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />

            <HistorySidebar 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
            />

            {/* History Toggle Button */}
            <button
                onClick={() => setIsHistoryOpen(true)}
                className="fixed bottom-8 left-8 p-4 bg-primary text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 group"
                title="View History"
            >
                <History size={24} />
                <span className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                    Download History
                </span>
            </button>
        </div>
    );
};

export default Home;
