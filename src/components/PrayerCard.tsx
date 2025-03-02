import React from 'react';
import { PrayerTime } from '../types/prayer';
import { formatTime } from '../services/prayerService';
import { Bell, BellOff } from 'lucide-react';

interface PrayerCardProps {
  prayer: PrayerTime;
  isNext: boolean;
  isReminderSet: boolean;
  onToggleReminder: (prayerName: string) => void;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ 
  prayer, 
  isNext, 
  isReminderSet,
  onToggleReminder
}) => {
  return (
    <div 
      className={`
        flex justify-between items-center p-4 rounded-lg mb-3
        ${isNext 
          ? 'bg-emerald-100 dark:bg-emerald-900 border-l-4 border-emerald-500' 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
        }
        transition-all duration-200 shadow-sm
      `}
    >
      <div className="flex items-center">
        <div className="mr-4 flex flex-col items-center justify-center">
          <span className={`
            text-lg font-bold
            ${isNext ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-800 dark:text-white'}
          `}>
            {prayer.name}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
            {prayer.arabicName}
          </span>
        </div>
      </div>
      
      <div className="flex items-center">
        <span className={`
          text-xl font-mono mr-4
          ${isNext ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-700 dark:text-gray-300'}
        `}>
          {formatTime(prayer.time)}
        </span>
        
        <button 
          onClick={() => onToggleReminder(prayer.name)}
          className={`
            p-2 rounded-full
            ${isReminderSet 
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-300' 
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}
            hover:bg-emerald-200 dark:hover:bg-emerald-700 transition-colors
          `}
          aria-label={isReminderSet ? `Remove reminder for ${prayer.name}` : `Set reminder for ${prayer.name}`}
        >
          {isReminderSet ? <Bell size={18} /> : <BellOff size={18} />}
        </button>
      </div>
    </div>
  );
};

export default PrayerCard;