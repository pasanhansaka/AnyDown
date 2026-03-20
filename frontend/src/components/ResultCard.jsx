import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Info, ExternalLink, Share2 } from 'lucide-react';
import FormatSelector from './FormatSelector';
import AspectRatioSelector from './AspectRatioSelector';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const ResultCard = () => {
    const { videoData, addToHistory } = useAppContext();
    const [aspectRatio, setAspectRatio] = useState('original');

    if (!videoData) return null;

    const handleDownload = (format) => {
        const queryParams = new URLSearchParams({
            url: videoData.original_url,
            format_id: format.format_id,
            aspect_ratio: aspectRatio,
            title: videoData.title
        });

        // Add to local history
        addToHistory({
            title: videoData.title,
            thumbnail: videoData.thumbnail,
            platform: videoData.platform,
            format: format.resolution || format.quality || 'Best',
            url: videoData.original_url
        });

        // Trigger download
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/download?${queryParams.toString()}`;
        toast.info('Starting download... Please wait.');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: videoData.title,
                url: videoData.original_url
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(videoData.original_url);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto mt-12 mb-20"
        >
            <div className="glass-card overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Video Preview */}
                    <div className="lg:w-2/5 relative aspect-video lg:aspect-square bg-black">
                        <img 
                            src={videoData.thumbnail} 
                            alt={videoData.title} 
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-end items-end p-6">
                            <div className="w-full">
                                <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                                    <span className="bg-primary/80 px-2 py-0.5 rounded">{videoData.platform}</span>
                                    {videoData.duration && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {Math.floor(videoData.duration / 60)}:{(videoData.duration % 60).toString().padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-white font-bold text-xl line-clamp-2 leading-tight">
                                    {videoData.title}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Format Options */}
                    <div className="lg:w-3/5 p-6 lg:p-8 space-y-8 max-h-[600px] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleShare}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm"
                                >
                                    <Share2 size={16} /> Share
                                </button>
                                <a 
                                    href={videoData.original_url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm"
                                >
                                    <ExternalLink size={16} /> Open Origin
                                </a>
                            </div>
                        </div>

                        <AspectRatioSelector selected={aspectRatio} onChange={setAspectRatio} />

                        <div className="space-y-8">
                            <FormatSelector 
                                formats={videoData.formats} 
                                onDownload={handleDownload} 
                                type="video" 
                            />
                            
                            <FormatSelector 
                                formats={videoData.formats} 
                                onDownload={handleDownload} 
                                type="audio" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
