import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

    const analyzeUrl = async (url) => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        if (!apiBaseUrl) {
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
                toast.success('Analysed successfully!');
                return response.data.data;
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
        <AppContext.Provider value={{
            loading, setLoading,
            videoData, setVideoData,
            error, setError,
            history, addToHistory, clearHistory,
            darkMode, setDarkMode,
            analyzeUrl
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
