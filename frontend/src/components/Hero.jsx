import React from 'react';
import { motion } from 'framer-motion';
import UrlInput from './UrlInput';
import { Youtube, Facebook, Instagram, Music, Download, Zap, Shield, Twitter, Linkedin, Globe } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 mb-6 uppercase tracking-wider">
                        <Zap size={14} className="fill-current" />
                        Super Fast & High Quality
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        Download Videos & MP3 <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-accent">
                            From Any Social Platform
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
                        Download high-quality videos and audio from <span className="text-primary font-bold">1,000+ supported sites</span> including YouTube, Facebook, Instagram, TikTok, and X.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <UrlInput />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-12 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default"
                >
                    <div className="flex items-center gap-2 font-bold text-lg"><Youtube className="text-[#FF0000]" /> YouTube</div>
                    <div className="flex items-center gap-2 font-bold text-lg"><Facebook className="text-[#1877F2]" /> Facebook</div>
                    <div className="flex items-center gap-2 font-bold text-lg"><Instagram className="text-[#E4405F]" /> Instagram</div>
                    <div className="flex items-center gap-2 font-bold text-lg"><Music className="text-current" /> TikTok</div>
                    <div className="flex items-center gap-2 font-bold text-lg"><Twitter className="text-[#1DA1F2]" /> X</div>
                    <div className="flex items-center gap-2 font-bold text-lg"><Linkedin className="text-[#0A66C2]" /> LinkedIn</div>
                    <div className="flex items-center gap-2 font-bold text-lg text-primary"><Globe /> 1,000+ More</div>
                </motion.div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Zap className="text-yellow-500" />, title: 'Lightning Fast', desc: 'High-speed processing and downloading with optimized servers.' },
                        { icon: <Shield className="text-blue-500" />, title: 'Safe & Secure', desc: 'No intrusive ads or malware. Your privacy is our top priority.' },
                        { icon: <Download className="text-green-500" />, title: 'Unlimited Downloads', desc: 'Download as many videos as you want without any restrictions.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            className="glass-card p-6 flex flex-col items-center text-center group hover:translate-y-[-4px] transition-transform"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
