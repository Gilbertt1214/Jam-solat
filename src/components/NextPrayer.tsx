import React, { useEffect } from "react";
import { PrayerTime } from "../types/prayer";
import { formatTime, getTimeRemaining } from "../services/prayerService";
import { Clock } from "lucide-react";

interface NextPrayerProps {
    nextPrayer: PrayerTime | null;
}

const NextPrayer: React.FC<NextPrayerProps> = ({ nextPrayer }) => {
    useEffect(() => {
        if (!nextPrayer) return;

        // Cek apakah browser mendukung Notification API
        if ("Notification" in window) {
            Notification.requestPermission();
        }

        // Hitung waktu tersisa hingga adzan
        const prayerTime = new Date(nextPrayer.time).getTime();
        const now = new Date().getTime();
        const timeUntilAdzan = prayerTime - now;

        if (timeUntilAdzan > 0) {
            const timer = setTimeout(() => {
                showAdzanNotification();
                playAdzanAudio();
            }, timeUntilAdzan);

            return () => clearTimeout(timer);
        }
    }, [nextPrayer]);

    const showAdzanNotification = () => {
        if (Notification.permission === "granted") {
            new Notification(`Waktunya ${nextPrayer?.name}`, {
                body: "Saatnya sholat, ayo segera laksanakan!",
                icon: "/path-to-your-icon.png",
            });
        }
    };

    const playAdzanAudio = () => {
        const audio = new Audio("src\assets\adzan.mp3"); // Ganti dengan path file adzan
        audio.play().catch((err) => console.error("Gagal memutar audio:", err));
    };

    if (!nextPrayer) {
        return null;
    }

    const timeRemaining = getTimeRemaining(nextPrayer.time);

    return (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-700 dark:to-teal-800 rounded-lg p-6 mb-6 text-white shadow-lg">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Clock className="mr-2" size={20} />
                Next 
            </h2>

            <div className="flex justify-between items-center">
                <div>
                    <p className="text-3xl font-bold">{nextPrayer.name}</p>
                    <p className="text-lg opacity-90 font-arabic">
                        {nextPrayer.arabicName}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-3xl font-mono">
                        {formatTime(nextPrayer.time)}
                    </p>
                    <p className="text-sm opacity-90">in {timeRemaining}</p>
                </div>
            </div>
        </div>
    );
};

export default NextPrayer;
