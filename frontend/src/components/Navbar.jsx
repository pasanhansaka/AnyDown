import React from 'react';
import { Download, Sun, Moon, Github } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
    const { darkMode, setDarkMode } = useAppContext();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <img src={`${import.meta.env.BASE_URL}anydown_logo.png`} alt="AnyDown Logo" className="w-8 h-8 rounded-lg shadow-lg shadow-primary/20" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                            AnyDown
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <a
                            href="https://github.com/pasanhansaka/AnyDown"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <Github size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
