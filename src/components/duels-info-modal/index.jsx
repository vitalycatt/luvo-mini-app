export const DuelInfoModal = ({ onClose, onPostpone }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full p-6 text-center shadow-xl">
        <h2 className="text-lg font-semibold mb-3">Как работает дуэль 👀</h2>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          Тебе показываются два профиля. Просто выбери того, кто тебе кажется
          симпатичнее. Это поможет улучшить алгоритм рекомендаций.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onPostpone}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Показать позже
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary-red text-white hover:bg-red-600 transition"
          >
            Ок
          </button>
        </div>
      </div>
    </div>
  );
};
