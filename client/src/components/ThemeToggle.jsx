import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center border ${
        theme === 'dark'
          ? 'bg-zinc-800/80 hover:bg-zinc-700 text-amber-400 border-zinc-700'
          : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
