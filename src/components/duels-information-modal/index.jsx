export const DuelsInformationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4">Как работает дуэль?</h2>

        <div className="shrink-0 mb-6 text-center">
          <h1 className="text-sm text-gray-500 leading-tight">
            Нас пускают по внешности? Нет.
            <br />
            Будут ли нас судить по внешности? Да 💫
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-primary-red text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Ок
          </button>
        </div>
      </div>
    </div>
  );
};
