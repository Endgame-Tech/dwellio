import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-200 group backdrop-blur-sm"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="relative">
                {theme === 'light' ? (
                    <FaMoon className="w-5 h-5 text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-100 transition-colors" />
                ) : (
                    <FaSun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                )}
            </div>

            {/* Hover effect background */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-50 to-blue-50 dark:from-blue-900/20 dark:to-yellow-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
        </button>
    );
};

export default DarkModeToggle;
