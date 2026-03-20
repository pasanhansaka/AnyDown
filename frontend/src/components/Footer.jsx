import React from 'react';
import { Download, Shield, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white/5 dark:bg-black/20 border-t border-gray-200 dark:border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary p-1.5 rounded-lg text-white">
                                <Download size={20} />
                            </div>
                            <span className="text-xl font-bold">AnyDown</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            The ultimate tool to download videos and audio from your favorite social media platforms. Fast, free, and secure.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Disclaimer</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Donate</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-white/10 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p className="flex items-center justify-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-current" /> for the community.
                    </p>
                    <p className="mt-2">
                        © {new Date().getFullYear()} AnyDown. All rights reserved.
                    </p>
                    <p className="mt-4 text-[10px] uppercase tracking-widest opacity-50">
                        This tool is intended for personal use and for content you have permission to download.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
