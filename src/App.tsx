import { useState, useEffect } from "react";
import { getUserLocation, fetchPrayerTimes } from "./services/prayerService";
import { PrayerSchedule, LocationData } from "./types/prayer";
import Header from "./components/Header";
import NextPrayer from "./components/NextPrayer";
import PrayerList from "./components/PrayerList";
import LocationSelector from "./components/LocationSelector";
import AdzanPlayer from "./components/AdzanPlayer";
import { MapPin, Loader } from "lucide-react";
import { format } from "date-fns"; // Pastikan date-fns diimpor

function App() {
    const [prayerSchedule, setPrayerSchedule] = useState<PrayerSchedule | null>(
        null
    );
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reminders, setReminders] = useState<string[]>([]);
    const [currentTime, setCurrentTime] = useState<string>(
        format(new Date(), "HH:mm")
    ); // Format: "HH:mm"
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        // Check user preference or system preference
        return (
            localStorage.getItem("darkMode") === "true" ||
            window.matchMedia("(prefers-color-scheme: dark)").matches
        );
    });
    const [showLocationSelector, setShowLocationSelector] =
        useState<boolean>(false);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newValue = !prev;
            localStorage.setItem("darkMode", String(newValue));
            return newValue;
        });
    };

    // Apply dark mode class to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    // Update current time every minute
    useEffect(() => {
        const updateCurrentTime = () => {
            setCurrentTime(format(new Date(), "HH:mm"));
        };

        // Update the time immediately
        updateCurrentTime();

        // Then update every minute
        const intervalId = setInterval(updateCurrentTime, 60000);

        return () => clearInterval(intervalId);
    }, []);

    // Load prayer times based on location
    useEffect(() => {
        const loadPrayerTimes = async () => {
            try {
                setLoading(true);
                setError(null);

                // Cek apakah ada lokasi tersimpan di localStorage
                const savedLocation = localStorage.getItem("prayerLocation");

                if (savedLocation && !location) {
                    // Gunakan lokasi tersimpan jika ada
                    setLocation(JSON.parse(savedLocation));
                } else if (!location) {
                    // Jika tidak ada lokasi tersimpan, gunakan geolokasi
                    try {
                        const userLocation = await getUserLocation();
                        setLocation(userLocation);
                        // Simpan lokasi ke localStorage
                        localStorage.setItem(
                            "prayerLocation",
                            JSON.stringify(userLocation)
                        );
                    } catch (locError) {
                        console.error("Error getting location:", locError);
                        // Fallback ke lokasi default jika gagal
                        const defaultLocation = {
                            city: "Mekkah",
                            country: "Arab Saudi",
                            latitude: 21.4225,
                            longitude: 39.8262,
                        };
                        setLocation(defaultLocation);
                        localStorage.setItem(
                            "prayerLocation",
                            JSON.stringify(defaultLocation)
                        );
                    }
                }

                if (location) {
                    const schedule = await fetchPrayerTimes(
                        location.latitude,
                        location.longitude
                    );
                    setPrayerSchedule(schedule);
                }
            } catch (err) {
                console.error("Error loading prayer times:", err);
                setError("Gagal memuat waktu sholat. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        loadPrayerTimes();
    }, [location]);

    // Load saved reminders from localStorage
    useEffect(() => {
        const savedReminders = localStorage.getItem("prayerReminders");
        if (savedReminders) {
            setReminders(JSON.parse(savedReminders));
        }
    }, []);

    // Toggle reminder for a prayer
    const handleToggleReminder = (prayerName: string) => {
        setReminders((prev) => {
            const newReminders = prev.includes(prayerName)
                ? prev.filter((name) => name !== prayerName)
                : [...prev, prayerName];

            // Save to localStorage
            localStorage.setItem(
                "prayerReminders",
                JSON.stringify(newReminders)
            );

            return newReminders;
        });
    };

    // Handle manual location selection
    const handleLocationSelect = async (city: string, country: string) => {
        try {
            setLoading(true);
            setError(null);

            // Find the selected location from our predefined list
            // This is a simplified approach - in a production app, we would use a more robust method
            // to get coordinates for the selected location
            let latitude = 21.4225; // Default to Mecca
            let longitude = 39.8262;

            // Indonesian cities
            if (city === "Serang") {
                latitude = -6.12;
                longitude = 106.1503;
            } else if (city === "Cilegon") {
                latitude = -6.0023;
                longitude = 106.0166;
            } else if (city === "Tangerang Selatan") {
                latitude = -6.2886;
                longitude = 106.7179;
            } else if (city === "Lebak") {
                latitude = -6.5644;
                longitude = 106.2522;
            } else if (city === "Pandeglang") {
                latitude = -6.3086;
                longitude = 106.1061;
            }
            if (city === "Jakarta") {
                latitude = -6.2088;
                longitude = 106.8456;
            } else if (city === "Surabaya") {
                latitude = -7.2575;
                longitude = 112.7521;
            } else if (city === "Bandung") {
                latitude = -6.9175;
                longitude = 107.6191;
            } else if (city === "Medan") {
                latitude = 3.5952;
                longitude = 98.6722;
            } else if (city === "Makassar") {
                latitude = -5.1477;
                longitude = 119.4327;
            } else if (city === "Yogyakarta") {
                latitude = -7.7971;
                longitude = 110.3688;
            } else if (city === "Aceh") {
                latitude = 4.6951;
                longitude = 96.7494;
            } else if (city === "Palembang") {
                latitude = -2.9761;
                longitude = 104.7754;
            } else if (city === "Semarang") {
                latitude = -6.9932;
                longitude = 110.4203;
            } else if (city === "Depok") {
                latitude = -6.4025;
                longitude = 106.7942;
            } else if (city === "Tangerang") {
                latitude = -6.1781;
                longitude = 106.63;
            }else if (city === "Bekasi") {
                latitude = -6.2349;
                longitude = 106.9896;
            } else if (city === "Padang") {
                latitude = -0.9471;
                longitude = 100.4172;
            } else if (city === "Malang") {
                latitude = -7.9797;
                longitude = 112.6304;
            } else if (city === "Denpasar") {
                latitude = -8.6705;
                longitude = 115.2126;
            } else if (city === "Balikpapan") {
                latitude = -1.2379;
                longitude = 116.8529;
            } else if (city === "Banjarmasin") {
                latitude = -3.3186;
                longitude = 114.5944;
            } else if (city === "Manado") {
                latitude = 1.4748;
                longitude = 124.8421;
            } else if (city === "Mataram") {
                latitude = -8.5833;
                longitude = 116.1167;
            } else if (city === "Ambon") {
                latitude = -3.6954;
                longitude = 128.1814;
            } else if (city === "Pontianak") {
                latitude = -0.0263;
                longitude = 109.3425;
            } else if (city === "Kupang") {
                latitude = -10.1772;
                longitude = 123.607;
            } else if (city === "Jambi") {
                latitude = -1.6101;
                longitude = 103.6131;
            } else if (city === "Pekanbaru") {
                latitude = 0.507;
                longitude = 101.4478;
            } else if (city === "Samarinda") {
                latitude = -0.4948;
                longitude = 117.1436;
            } else if (city === "Tasikmalaya") {
                latitude = -7.3274;
                longitude = 108.2207;
            } else if (city === "Bandar Lampung") {
                latitude = -5.3971;
                longitude = 105.2663;
            } else if (city === "Cirebon") {
                latitude = -6.732;
                longitude = 108.5523;
            } else if (city === "Surakarta") {
                latitude = -7.5755;
                longitude = 110.8243;
            } else if (city === "Jayapura") {
                latitude = -2.5916;
                longitude = 140.669;
            } else if (city === "Palu") {
                latitude = -0.9003;
                longitude = 119.8779;
            } else if (city === "Kendari") {
                latitude = -3.9985;
                longitude = 122.5129;
            } else if (city === "Sorong") {
                latitude = -0.8761;
                longitude = 131.2548;
            } else if (city === "Gorontalo") {
                latitude = 0.5435;
                longitude = 123.0568;
            } else if (city === "Madiun") {
                latitude = -7.6298;
                longitude = 111.53;
            } else if (city === "Sukabumi") {
                latitude = -6.9277;
                longitude = 106.93;
            } else if (city === "Tegal") {
                latitude = -6.8694;
                longitude = 109.1402;
            } else if (city === "Bogor") {
                latitude = -6.5971;
                longitude = 106.806;
            }
            

            const selectedLocation = {
                city,
                country,
                latitude,
                longitude,
            };

            // Simpan lokasi ke localStorage
            localStorage.setItem(
                "prayerLocation",
                JSON.stringify(selectedLocation)
            );

            setLocation(selectedLocation);
            setShowLocationSelector(false);
        } catch (err) {
            console.error("Error setting location:", err);
            setError("Failed to set location. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-200">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header with location and date */}
                <Header
                    location={location}
                    date={prayerSchedule?.date || ""}
                    hijriDate={prayerSchedule?.hijriDate || ""}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                />

                {/* Location selector button */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setShowLocationSelector((prev) => !prev)}
                        className="flex items-center text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <MapPin
                            size={16}
                            className="mr-1 text-emerald-600 dark:text-emerald-400"
                        />
                        {showLocationSelector
                            ? "Hide Locations"
                            : "Change Location"}
                    </button>
                </div>

                {/* Location selector */}
                {showLocationSelector && (
                    <LocationSelector onLocationSelect={handleLocationSelect} />
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            Loading prayer times...
                        </p>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 bg-red-200 dark:bg-red-800 px-4 py-2 rounded-md text-sm"
                        >
                            Retry
                        </button>
                    </div>
                ) : prayerSchedule ? (
                    <>
                        {/* Next prayer highlight */}
                        <NextPrayer nextPrayer={prayerSchedule.nextPrayer} />

                        {/* Prayer times list */}
                        <PrayerList
                            prayerTimes={prayerSchedule.prayerTimes}
                            nextPrayer={prayerSchedule.nextPrayer}
                            reminders={reminders}
                            onToggleReminder={handleToggleReminder}
                        />

                        {/* Adzan Player */}
                        {prayerSchedule.prayerTimes && (
                            <AdzanPlayer
                                prayerTimes={prayerSchedule.prayerTimes}
                                currentTime={currentTime}
                            />
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default App;
