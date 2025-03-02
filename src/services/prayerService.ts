import axios from "axios";
import { format, parse, isAfter } from "date-fns";
import { PrayerTime, PrayerSchedule, LocationData } from "../types/prayer";

// Nama-nama waktu sholat dalam bahasa Indonesia
const prayerNames = {
    Imsak: " الإمساك", 
    Fajr: " الفجر",
    Sunrise: " الشروق",
    Dhuhr: " الظهر",
    Asr: " العصر",
    Maghrib: "المغرب",
    Isha: " العشاء",
};



// Mendapatkan lokasi pengguna menggunakan API geolokasi browser
export const getUserLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolokasi tidak didukung oleh browser Anda"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Gunakan reverse geocoding untuk mendapatkan kota dan negara
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const address = response.data.address;

                    resolve({
                        city:
                            address.city ||
                            address.town ||
                            address.village ||
                            "Tidak Diketahui",
                        country: address.country || "Tidak Diketahui",
                        latitude,
                        longitude,
                    });
                } catch (error) {
                    // Default ke lokasi Mekkah jika gagal
                    resolve({
                        city: "Mekkah",
                        country: "Arab Saudi",
                        latitude: 21.4225,
                        longitude: 39.8262,
                    });
                }
            },
            (error) => {
                console.error("Gagal mendapatkan lokasi:", error);
                // Default ke lokasi Mekkah
                resolve({
                    city: "Mekkah",
                    country: "Arab Saudi",
                    latitude: 21.4225,
                    longitude: 39.8262,
                });
            }
        );
    });
};

// Mengambil waktu sholat dari API
export const fetchPrayerTimes = async (
    latitude: number,
    longitude: number
): Promise<PrayerSchedule> => {
    try {
        const today = new Date();
        const dateStr = format(today, "dd-MM-yyyy");

        // Menggunakan API AlAdhan untuk mendapatkan waktu sholat
        const response = await axios.get(
            `https://api.aladhan.com/v1/timings/${dateStr}`,
            {
                params: {
                    latitude,
                    longitude,
                    method: 2, // Metode perhitungan Islamic Society of North America
                },
            }
        );

        const { data } = response.data;
        const timings = data.timings;
        const hijriDate = `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year}`;

        // Format waktu sholat
        const prayerTimes: PrayerTime[] = [
            {
                name: "Imsak",
                time: timings.Imsak,
                arabicName: prayerNames.Imsak,
            },
            { name: "Subuh", time: timings.Fajr, arabicName: prayerNames.Fajr },
            {
                name: "Matahari Terbit",
                time: timings.Sunrise,
                arabicName: prayerNames.Sunrise,
            },
            {
                name: "Zuhur",
                time: timings.Dhuhr,
                arabicName: prayerNames.Dhuhr,
            },
            { name: "Ashar", time: timings.Asr, arabicName: prayerNames.Asr },
            {
                name: "Maghrib",
                time: timings.Maghrib,
                arabicName: prayerNames.Maghrib,
            },
            { name: "Isya", time: timings.Isha, arabicName: prayerNames.Isha },
        ];

        // Menentukan sholat berikutnya
        const currentTime = format(new Date(), "HH:mm");
        let nextPrayer: PrayerTime | null = null;

        for (const prayer of prayerTimes) {
            if (prayer.time > currentTime) {
                nextPrayer = prayer;
                break;
            }
        }

        // Jika semua sholat hari ini telah berlalu, sholat berikutnya adalah Imsak besok
        if (!nextPrayer && prayerTimes.length > 0) {
            nextPrayer = prayerTimes[0];
        }

        return {
            date: format(today, "EEEE, MMMM d, yyyy"),
            hijriDate,
            prayerTimes,
            nextPrayer,
        };
    } catch (error) {
        console.error("Gagal mengambil waktu sholat:", error);
        throw new Error("Gagal mengambil waktu sholat");
    }
};

// Format waktu dari 24 jam ke 12 jam
export const formatTime = (time: string): string => {
    try {
        const date = parse(time, "HH:mm", new Date());
        const hour = format(date, "HH");
        const minute = format(date, "mm");

        let period = "";
        const hourNum = parseInt(hour, 10);

        if (hourNum >= 0 && hourNum < 6) {
            period = "Pagi";
        } else if (hourNum >= 6 && hourNum < 12) {
            period = "Pagi";
        } else if (hourNum >= 12 && hourNum < 15) {
            period = "Siang";
        } else if (hourNum >= 15 && hourNum < 18) {
            period = "Sore";
        } else {
            period = "Malam";
        }

        return `${hour}:${minute} ${period}`;
    } catch (error) {
        return time;
    }
};

// Menghitung waktu tersisa hingga sholat berikutnya
export const getTimeRemaining = (prayerTime: string): string => {
    try {
        const now = new Date();
        const [hours, minutes] = prayerTime.split(":").map(Number);

        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0);

        // Jika waktu sholat telah berlalu, atur untuk besok
        if (isAfter(now, prayerDate)) {
            prayerDate.setDate(prayerDate.getDate() + 1);
        }

        const diffMs = prayerDate.getTime() - now.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${diffHrs}j ${diffMins}m`;
    } catch (error) {
        return "Tidak diketahui";
    }
};
