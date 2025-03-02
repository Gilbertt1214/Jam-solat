export interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
}

export interface PrayerSchedule {
  date: string;
  hijriDate: string;
  prayerTimes: PrayerTime[];
  nextPrayer: PrayerTime | null;
}

export interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}