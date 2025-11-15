export const DuelProgressBar = ({ duelsCount, duelsLimit = 15 }) => {
  return (
    <div className="w-full px-6 py-2">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary-red h-2.5 transition-all duration-300"
          style={{ width: `${(duelsCount / duelsLimit) * 100}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
        <div>
          <strong className="text-gray-800 dark:text-gray-200">
            {duelsCount}
          </strong>{" "}
          из {duelsLimit} сравнений
        </div>
      </div>
    </div>
  );
};
