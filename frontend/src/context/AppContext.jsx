import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [videoData, setVideoData] = useState(null);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const [darkMode, setDarkMode] = useState(true);

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('anydown_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }

        const savedMode = localStorage.getItem('anydown_darkmode');
        if (savedMode !== null) {
            setDarkMode(JSON.parse(savedMode));
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('anydown_history', JSON.stringify(history));
    }, [history]);

    // Save dark mode preference
    useEffect(() => {
        localStorage.setItem('anydown_darkmode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const addToHistory = (item) => {
        const newItem = {
            ...item,
            id: Date.now(),
            date: new Date().toISOString()
        };
        setHistory(prev => [newItem, ...prev.slice(0, 19)]); // Keep last 20 items
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <AppContext.Provider value={{
            loading, setLoading,
            videoData, setVideoData,
            error, setError,
            history, addToHistory, clearHistory,
            darkMode, setDarkMode
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
