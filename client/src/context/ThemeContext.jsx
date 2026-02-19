import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    const cycleTheme = () => {
        setTheme(prev => {
            if (prev === 'dark') return 'pure-black';
            return 'dark';
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
