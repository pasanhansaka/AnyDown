import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, User, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const PlaylistCard = () => {
    const { videoData, analyzeUrl } = useAppContext();

    if (!videoData || !videoData.is_collection) return null;

    const handleSelect = async (url) => {
        await analyzeUrl(url);
        // The page will automatically scroll to the new ResultCard thanks to its useEffect
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl mx-auto mt-12 mb-20 px-4"
        >
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                        <Play size={16} fill="currentColor" />
                        {videoData.platform} Collection
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white">
                        {videoData.title}
                    </h2>
                    <p className="text-gray-400 font-medium">
                        Found {videoData.entries?.length || 0} videos in this collection. Select one to analyze and download.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(videoData.entries || []).map((entry, index) => (
                    <motion.div
                        key={entry.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
                        onClick={() => handleSelect(entry.url)}
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden">
                            <img 
                                src={entry.thumbnail || videoData.thumbnail} 
                                alt={entry.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />
                            {entry.duration && (
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white flex items-center gap-1">
                                    <Clock size={10} />
                                    {Math.floor(entry.duration / 60)}:{(entry.duration % 60).toString().padStart(2, '0')}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <Search size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                            <h3 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {entry.title}
                            </h3>
                            
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                {entry.uploader && (
                                    <div className="flex items-center gap-1 truncate max-w-[120px]">
                                        <User size={10} />
                                        {entry.uploader}
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                                    Analyze <ArrowRight size={10} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default PlaylistCard;
