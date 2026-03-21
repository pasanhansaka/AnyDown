import React, { useState } from 'react';
import { Download, Shield, Heart, Coffee, Github } from 'lucide-react';
import LegalModal from './LegalModal';

const Footer = () => {
    const [modal, setModal] = useState({ isOpen: false, type: 'privacy' });

    const openModal = (type) => setModal({ isOpen: true, type });
    const closeModal = () => setModal({ isOpen: false, type: 'privacy' });

    return (
        <footer className="bg-white/5 dark:bg-black/20 border-t border-gray-200 dark:border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={`${import.meta.env.BASE_URL}anydown_logo.png`} alt="AnyDown Logo" className="w-7 h-7 rounded-lg shadow-lg shadow-primary/20" />
                            <span className="text-xl font-bold">AnyDown</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            The ultimate tool to download videos and audio from your favorite social media platforms. Fast, free, and secure.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-4 text-primary">Legal</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><button onClick={() => openModal('privacy')} className="hover:text-primary transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => openModal('terms')} className="hover:text-primary transition-colors">Terms of Service</button></li>
                            <li><button onClick={() => openModal('disclaimer')} className="hover:text-primary transition-colors">Disclaimer</button></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-primary">Support</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><a href="mailto:thornsolution@gmail.com" className="hover:text-primary transition-colors">Contact Us</a></li>
                            <li>
                                <a 
                                    href="https://github.com/sponsors/pasanhansaka" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <Github size={14} /> GitHub Sponsor
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://www.buymeacoffee.com/pasanhansaka" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 hover:text-primary transition-colors"
                                >
                                    <Coffee size={14} /> Buy Me a Coffee
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-white/10 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p className="flex items-center justify-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-current" /> for the community.
                    </p>
                    <p className="mt-2 text-slate-400">
                        © {new Date().getFullYear()} <span className="text-primary font-bold">Thorn Solution</span>. All rights reserved.
                    </p>
                    <p className="mt-4 text-[10px] uppercase tracking-widest opacity-50">
                        This tool is intended for personal use and for content you have permission to download.
                    </p>
                </div>
            </div>

            <LegalModal 
                isOpen={modal.isOpen} 
                onClose={closeModal} 
                type={modal.type} 
            />
        </footer>
    );
};

export default Footer;
