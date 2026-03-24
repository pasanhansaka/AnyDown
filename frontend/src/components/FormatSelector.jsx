import React from 'react';
import { Film, Music, Download, CheckCircle, ShieldCheck } from 'lucide-react';

const FormatSelector = ({ formats, onDownload, type = 'video' }) => {
    const filteredFormats = formats.filter(f => type === 'video' ? f.is_video : f.is_audio);

    const formatSize = (bytes) => {
        if (!bytes || bytes === 0) return 'Dynamic';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                {type === 'video' ? <Film size={14} /> : <Music size={14} />} 
                {type === 'video' ? 'Video Formats' : 'Audio Formats'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredFormats.map((format, idx) => (
                    <button
                        key={idx}
                        onClick={() => onDownload(format)}
                        className={`glass-card p-4 flex items-center justify-between group transition-all text-left relative overflow-hidden ${
                            format.is_virtual 
                            ? 'border-primary/40 bg-primary/10 shadow-lg shadow-primary/10 hover:border-primary hover:bg-primary/20' 
                            : 'hover:border-primary/50 hover:bg-primary/5'
                        }`}
                    >
                        {format.is_virtual && (
                            <div className="absolute top-0 right-0">
                                <div className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
                                    <ShieldCheck size={8} /> Best
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">
                                {type === 'video' ? (format.resolution || format.quality) : (format.quality || 'Standard Quality')}
                            </span>
                            <span className={`text-xs uppercase font-medium ${format.is_virtual ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                                {format.extension} • {formatSize(format.filesize)}
                            </span>
                        </div>
                        <div className={`p-2 rounded-lg transition-all ${
                            format.is_virtual 
                            ? 'bg-primary text-white group-hover:scale-110 shadow-lg' 
                            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                        }`}>
                            <Download size={16} />
                        </div>
                    </button>
                ))}
                
                {filteredFormats.length === 0 && (
                    <p className="text-sm text-gray-500 italic col-span-full">No {type} formats available for this link.</p>
                )}
            </div>
        </div>
    );
};

export default FormatSelector;
