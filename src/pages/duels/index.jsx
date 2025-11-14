import { useEffect, useState } from "react";
import { useDuelProgressStore } from "@/store/duelProgressStore";
import { useDuelPair, useDuelNextPair } from "@/api/duels";
import {
  Spinner,
  DuelProgressBar,
  DuelsBlockModal,
  DuelsBattleCards,
  DuelsInformationModal,
} from "@/components";

export const DuelsPage = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { mutate: nextPair, isPending: isVoting } = useDuelNextPair();
  const { data: pairData, isLoading, error, refetch } = useDuelPair();
  const { increment, isBlocked, limitUntil, refreshFromStorage } =
    useDuelProgressStore();

  useEffect(() => {
    const hasSeen = localStorage.getItem("duelsHelpStatus");
    if (!hasSeen) setShowHelpModal(true);
  }, []);

  useEffect(() => {
    refreshFromStorage();
  }, []);

  const handleSelectAndVote = (winnerId) => {
    if (isVoting || !pairData || isBlocked) return;

    setSelectedUserId(winnerId);
    nextPair(winnerId, {
      onSettled: () => {
        setSelectedUserId(null);
        increment();
      },
    });
  };

  const handleOkHelp = () => {
    setShowHelpModal(false);
    localStorage.setItem("duelsHelpStatus", "seen");
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>

          <h2 className="text-xl font-bold mb-3">Ошибка загрузки</h2>

          <button
            onClick={() => refetch()}
            className="bg-primary-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!pairData?.user || !pairData?.opponent) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>

          <h2 className="text-xl font-bold mb-3">Недостаточно данных</h2>

          <button
            onClick={() => refetch()}
            className="bg-primary-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col overflow-hidden relative">
      <DuelProgressBar />

      <DuelsBattleCards
        isVoting={isVoting}
        pairData={pairData}
        isBlocked={isBlocked}
        selectedUserId={selectedUserId}
        handleSelectAndVote={handleSelectAndVote}
      />

      <div className="pb-6 text-center">
        <button
          onClick={() => setShowHelpModal(true)}
          className="text-gray-400 text-sm underline hover:text-gray-600 transition"
        >
          Как это работает?
        </button>
      </div>

      {showHelpModal && <DuelsInformationModal onClose={handleOkHelp} />}

      {isBlocked && <DuelsBlockModal limitUntil={limitUntil} />}
    </div>
  );
};
