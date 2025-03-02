import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { PrayerTime } from "../types/prayer";

interface AdzanPlayerProps {
    prayerTimes: PrayerTime[];
    currentTime: string; // Format "HH:mm"
}

const AdzanPlayer: React.FC<AdzanPlayerProps> = ({
    prayerTimes,
    currentTime,
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentPrayer, setCurrentPrayer] = useState<PrayerTime | null>(null);
    const [isMuted, setIsMuted] = useState<boolean>(() => {
        return localStorage.getItem("adzanMuted") === "true";
    });

    useEffect(() => {
        // Cek apakah waktu saat ini sama dengan waktu salah satu waktu sholat
        const matchingPrayer = prayerTimes.find(
            (prayer) => prayer.time === currentTime
        );
        

        if (matchingPrayer && !isMuted) {
            // Jangan putar adzan untuk Matahari Terbit
            if (matchingPrayer.name !== "Matahari Terbit") {
                setCurrentPrayer(matchingPrayer);

                if (audioRef.current) {
                    audioRef.current
                        .play()
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch((error) => {
                            console.error("Gagal memainkan adzan:", error);
                        });
                }
            }
        }
    }, [currentTime, prayerTimes, isMuted]);

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        localStorage.setItem("adzanMuted", String(newMutedState));

        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const stopAdzan = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="../assets/adzan.mp3"
                onEnded={() => setIsPlaying(false)}
            />

            {isPlaying && (
                <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex items-center space-x-3 z-50">
                    <div className="flex-1">
                        <p className="font-medium">
                            Adzan {currentPrayer?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentTime}
                        </p>
                    </div>
                    <button
                        onClick={stopAdzan}
                        className="bg-red-100 dark:bg-red-800 p-2 rounded-full text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700"
                        aria-label="Stop adzan"
                    >
                        <VolumeX size={16} />
                    </button>
                </div>
            )}

            <button
                onClick={toggleMute}
                className={`fixed bottom-4 left-4 p-3 rounded-full shadow-lg z-50 ${
                    isMuted
                        ? "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300"
                        : "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300"
                }`}
                aria-label={isMuted ? "Aktifkan adzan" : "Nonaktifkan adzan"}
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </>
    );
};

export default AdzanPlayer;
