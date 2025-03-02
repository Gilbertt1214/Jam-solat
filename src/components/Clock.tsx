import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Menambahkan offset waktu 7 jam
    const adjustedTime = new Date(time.getTime() + 5.39 * 60 * 60 * 1000);

    return (
        <div className="flex flex-col items-start w-full max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">Ramadhan Kareem</h2>
            <div className="text-lg font-mono font-bold flex gap-1">
                {adjustedTime
                    .toLocaleTimeString("id-ID", { hour12: false })
                    .split("")
                    .map((char, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {char}
                        </motion.span>
                    ))}
            </div>
        </div>
    );
};

export default Clock;
