import React, { useState, useEffect } from 'react';
import { Search, Clipboard, Play, Youtube, Facebook, Instagram, Music, Twitter, Linkedin } from 'lucide-react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const UrlInput = () => {
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState(null);
    const { setLoading, setVideoData, setError } = useAppContext();

    const detectPlatform = (val) => {
        if (/youtube\.com|youtu\.be/.test(val)) return { name: 'YouTube', icon: <Youtube className="text-[#FF0000]" />, color: 'from-[#FF0000] to-[#CC0000]' };
        if (/facebook\.com|fb\.watch/.test(val)) return { name: 'Facebook', icon: <Facebook className="text-[#1877F2]" />, color: 'from-[#1877F2] to-[#0C5DC7]' };
        if (/instagram\.com/.test(val)) return { name: 'Instagram', icon: <Instagram className="text-[#E4405F]" />, color: 'from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]' };
        if (/tiktok\.com/.test(val)) return { name: 'TikTok', icon: <Music className="text-[#000000] dark:text-white" />, color: 'from-[#000000] to-[#25F4EE]' };
        if (/twitter\.com|x\.com/.test(val)) return { name: 'X (Twitter)', icon: <Twitter className="text-[#1DA1F2]" />, color: 'from-[#1DA1F2] to-[#0C85D0]' };
        if (/linkedin\.com/.test(val)) return { name: 'LinkedIn', icon: <Linkedin className="text-[#0A66C2]" />, color: 'from-[#0A66C2] to-[#004182]' };
        return null;
        return null;
    };

    useEffect(() => {
        setPlatform(detectPlatform(url));
    }, [url]);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
        } catch (err) {
            toast.error('Failed to read clipboard');
        }
    };

    const handleAnalyze = async (e) => {
        if (e) e.preventDefault();
        if (!url) return;

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!apiBaseUrl) {
            console.error('API Base URL is not defined in .env');
            const msg = 'Configuration error: API Base URL is missing';
            setError(msg);
            toast.error(msg);
            return;
        }

        setLoading(true);
        setError(null);
        setVideoData(null);

        try {
            console.log(`Analyzing URL: ${url}`);
            const response = await axios.post(`${apiBaseUrl}/analyze`, { url });
            if (response.data.success) {
                setVideoData(response.data.data);
                toast.success('Video analyzed successfully!');
            } else {
                const msg = response.data.message || 'Analysis failed';
                setError(msg);
                toast.error(msg);
            }
        } catch (err) {
            console.error('API Error:', err);
            const msg = err.response?.data?.message || 'Failed to connect to server. Please ensure the backend is running.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            <form onSubmit={handleAnalyze} className="relative group">
                <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${platform ? platform.color : 'from-primary to-primary-light'} opacity-25 group-focus-within:opacity-50 blur transition duration-500`}></div>
                
                <div className="relative flex items-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="pl-4 text-gray-400">
                        {platform ? platform.icon : <Search size={24} />}
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Paste video URL here..."
                        className="w-full py-5 px-4 bg-transparent outline-none text-lg font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <div className="flex items-center gap-2 pr-4">
                        <button
                            type="button"
                            onClick={handlePaste}
                            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors"
                            title="Paste from clipboard"
                        >
                            <Clipboard size={20} />
                        </button>
                        
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2 px-8"
                            disabled={!url}
                        >
                            <span>Download</span>
                            <Play size={18} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </form>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest text-slate-500 opacity-60">
                <span>YouTube</span>
                <span>Facebook</span>
                <span>Instagram</span>
                <span>TikTok</span>
                <span>Twitter/X</span>
                <span>LinkedIn</span>
                <span className="text-primary italic">1,000+ More</span>
            </div>

            {platform && (
                <div className="flex justify-center">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${platform.color} shadow-lg animate-in fade-in zoom-in duration-300`}>
                        {platform.name} Detected
                    </span>
                </div>
            )}
        </div>
    );
};

export default UrlInput;
