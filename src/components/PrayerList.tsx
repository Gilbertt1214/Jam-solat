import React from 'react';
import { PrayerTime } from '../types/prayer';
import PrayerCard from './PrayerCard';

interface PrayerListProps {
  prayerTimes: PrayerTime[];
  nextPrayer: PrayerTime | null;
  reminders: string[];
  onToggleReminder: (prayerName: string) => void;
}

const PrayerList: React.FC<PrayerListProps> = ({ 
  prayerTimes, 
  nextPrayer, 
  reminders,
  onToggleReminder
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Today's Prayer Schedule</h2>
      
      <div>
        {prayerTimes.map((prayer) => (
          <PrayerCard
            key={prayer.name}
            prayer={prayer}
            isNext={nextPrayer?.name === prayer.name}
            isReminderSet={reminders.includes(prayer.name)}
            onToggleReminder={onToggleReminder}
          />
        ))}
      </div>
    </div>
  );
};

export default PrayerList;