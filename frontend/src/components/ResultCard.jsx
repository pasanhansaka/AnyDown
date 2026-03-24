import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Info, ExternalLink, Share2, Play, Pause, Volume2, RotateCcw } from 'lucide-react';
import FormatSelector from './FormatSelector';
import AspectRatioSelector from './AspectRatioSelector';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const ResultCard = () => {
    const { videoData, addToHistory } = useAppContext();
    const [aspectRatio, setAspectRatio] = useState('original');
    const [showPreview, setShowPreview] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        if (cardRef.current) {
            setTimeout(() => {
                cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, []);

    if (!videoData) return null;

    // Find a playable stream (prefer MP4 for compatibility)
    const previewFormat = videoData.formats.find(f => f.is_video && f.extension === 'mp4' && !f.is_virtual) || 
                         videoData.formats.find(f => f.is_video && !f.is_virtual);
    
    const audioPreview = videoData.formats.find(f => f.is_audio);

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
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto mt-12 mb-20"
        >
            <div className="glass-card overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Video Preview Area */}
                    <div className="lg:w-2/5 relative aspect-video lg:aspect-square bg-black group/preview">
                        {!showPreview ? (
                            <>
                                <img 
                                    src={videoData.thumbnail} 
                                    alt={videoData.title} 
                                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover/preview:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                                            <span className="bg-primary/80 px-2 py-0.5 rounded backdrop-blur-sm">{videoData.platform}</span>
                                        </div>
                                        {videoData.duration && (
                                            <span className="flex items-center gap-1 text-white/80 text-xs font-bold bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                                                <Clock size={12} />
                                                {Math.floor(videoData.duration / 60)}:{(videoData.duration % 60).toString().padStart(2, '0')}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h2 className="text-white font-bold text-xl line-clamp-2 leading-tight drop-shadow-lg">
                                            {videoData.title}
                                        </h2>
                                        
                                        {(previewFormat || audioPreview) && (
                                            <button 
                                                onClick={() => setShowPreview(true)}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white text-black hover:bg-primary hover:text-white rounded-xl font-bold transition-all transform group-hover/preview:translate-y-0 translate-y-2 opacity-0 group-hover/preview:opacity-100 shadow-2xl"
                                            >
                                                <Play size={18} fill="currentColor" />
                                                Watch Preview
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {previewFormat ? (
                                    <video 
                                        src={previewFormat.url} 
                                        controls 
                                        autoPlay 
                                        className="w-full h-full object-contain"
                                        poster={videoData.thumbnail || `${import.meta.env.BASE_URL}anydown_logo.png`}
                                    />
                                ) : (
                                    <div className="p-8 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
                                            <Volume2 size={32} className="text-primary" />
                                        </div>
                                        <h3 className="font-bold">Audio Preview Only</h3>
                                        <audio src={audioPreview?.url} controls autoPlay className="w-full" />
                                    </div>
                                )}
                                <button 
                                    onClick={() => setShowPreview(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black rounded-full text-white backdrop-blur-md transition-all z-10"
                                    title="Close Preview"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                        )}
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
