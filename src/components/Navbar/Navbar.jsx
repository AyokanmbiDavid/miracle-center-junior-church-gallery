import React, { useState, useEffect } from 'react';
import applogo from '../../images/images.png';
import { Sun, Moon } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation().pathname
  // Initialize state directly from localStorage if it exists
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Keep the DOM class synchronized on initial mount and theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="w-full p-3 flex justify-between items-center bg-white dark:bg-gray-900 transition-all duration-200">
      <div className="flex gap-2 items-center">
        <div className="rounded-full">
          <img src={applogo} alt="App Logo" className="rounded-full h-10 w-10 object-cover" />
        </div>

        <div>
          <h1 className="text-md text-gray-800 dark:text-white">
            Junior church Gallery |
            <span className="font-bold">
               {location == '/' ? '' :
             location == '/dailystatus' ? 'Status' : location == '/throwback' ? 'Throwback' : ''}

            </span>
          </h1>
        </div>
      </div>

      <div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border-2 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={20} weight="fill" className="text-yellow-400" />
          ) : (
            <Moon size={20} weight="fill" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;