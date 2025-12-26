import { CountdownTimer } from "./countdown-timer";

export const DuelsBlockModal = ({ limitUntil = 0 }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6">
      <div className="bg-white/90 dark:bg-black/80 rounded-2xl shadow-lg px-6 py-8 max-w-sm w-full text-center border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Ты достиг лимита сравнений 😌
        </h2>

        {limitUntil && <CountdownTimer targetDate={new Date(limitUntil)} />}

        <p className="text-gray-600 dark:text-gray-400 mt-6 text-sm leading-snug">
          Сегодня вы встретились,
          <br />а завтра всё может измениться 💫
        </p>
      </div>
    </div>
  );
};
