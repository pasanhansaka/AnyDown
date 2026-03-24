import React from 'react';
import { ShieldAlert, Key, ExternalLink, Globe } from 'lucide-react';

const RestrictedNotice = ({ message }) => {
    return (
        <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/50 border border-red-500/20 backdrop-blur-xl overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 animate-pulse">
                    <ShieldAlert size={40} />
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-2xl font-black italic tracking-tight text-white uppercase">Video Restricted</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                        This video requires higher authentication (cookies) or a different proxy to download because it is age-restricted or private.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3">
                        <Key size={24} className="text-primary" />
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">
                            Cookie Support
                        </div>
                        <p className="text-[11px] text-gray-400 text-center leading-tight">
                            Try adding a <code className="text-primary">cookies.txt</code> file to the server root for full bypass.
                        </p>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3">
                        <Globe size={24} className="text-primary" />
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">
                            Alternative Access
                        </div>
                        <a 
                            href="https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] text-primary hover:underline italic"
                        >
                            Read Workaround Guide <ExternalLink size={10} />
                        </a>
                    </div>
                </div>

                {message && (
                    <div className="px-4 py-2 bg-red-500/5 rounded-xl border border-red-500/10">
                        <p className="text-[10px] text-red-400 italic">Error Info: {message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestrictedNotice;
