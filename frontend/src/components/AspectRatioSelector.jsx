import React, { useState } from 'react';
import { Layout, Maximize2, Smartphone, Square, Monitor } from 'lucide-react';

const AspectRatioSelector = ({ selected, onChange }) => {
    const options = [
        { id: 'original', label: 'Original', icon: <Maximize2 size={16} /> },
        { id: '16:9', label: '16:9 Widescreen', icon: <Monitor size={16} /> },
        { id: '9:16', label: '9:16 TikTok/Reels', icon: <Smartphone size={16} /> },
        { id: '1:1', label: '1:1 Square', icon: <Square size={16} /> },
        { id: '4:3', label: '4:3 Classic', icon: <Layout size={16} /> },
    ];

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Maximize2 size={14} /> Change Aspect Ratio
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                            selected === option.id
                                ? 'bg-primary/20 border-primary text-primary shadow-sm shadow-primary/20'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                ))}
            </div>
            <p className="text-[10px] text-gray-500 italic">
                * Note: Changing aspect ratio will crop the video to fit the selected frame.
            </p>
        </div>
    );
};

export default AspectRatioSelector;
