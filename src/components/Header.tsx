import React from 'react';
import { Moon, Sun,  } from 'lucide-react';
import { LocationData } from '../types/prayer';
import Clock from './Clock';


interface HeaderProps {
  location: LocationData | null;
  date: string;
  hijriDate: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  location, 
  date, 
  hijriDate, 
  isDarkMode, 
  toggleDarkMode 
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 rounded-lg mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Clock/>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-600 dark:text-gray-300">
          {location ? `${location.city}, ${location.country}` : 'Loading location...'}
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-between mt-2">
          <p className="text-gray-500 dark:text-gray-400">{date}</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">{hijriDate}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;