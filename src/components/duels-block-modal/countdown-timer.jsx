import { useState, useEffect } from "react";
import { Spinner } from "@/components";

export const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCompact, setIsCompact] = useState(false); // следим за шириной экрана

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 360);
    };

    handleResize(); // при монтировании
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = Math.max(target - now, 0);

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    setIsInitialized(true);

    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center mt-6">
        <Spinner size="sm" />
      </div>
    );
  }

  const { hours, minutes, seconds } = timeLeft;

  return (
    <div
      className={`flex justify-center items-center gap-2 mt-4 select-none ${
        isCompact ? "scale-90" : ""
      }`}
    >
      <TimeBlock value={hours} label="ч" />
      <Separator />
      <TimeBlock value={minutes} label="м" />
      {!isCompact && (
        <>
          <Separator />
          <TimeBlock value={seconds} label="с" />
        </>
      )}
    </div>
  );
};

const TimeBlock = ({ value, label }) => (
  <div className="text-center">
    <div className="text-4xl font-extrabold text-primary-red bg-white/90 dark:bg-black/90 rounded-xl px-4 py-2 min-w-[72px] shadow-sm">
      {value.toString().padStart(2, "0")}
    </div>
    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{label}</div>
  </div>
);

const Separator = () => (
  <div className="text-2xl font-bold text-primary-red mb-5">:</div>
);
