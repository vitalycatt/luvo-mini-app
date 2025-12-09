import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useDuelPair } from "@/api/duels";
import {
  Spinner,
  DuelsWinnerCard,
  DuelProgressBar,
  DuelsBattleCards,
  DuelsInformationModal,
} from "@/components";

import { DuelsEmptyIcon } from "@/assets/icons/duels-empty";

export const DuelsPage = () => {
  const [step, setStep] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { data, isLoading } = useDuelPair(winnerId, step);

  const duelsCount = data?.stage || 0;
  const isBlocked = !!data?.final_winner; // Блокируем когда есть победитель

  useEffect(() => {
    const hasSeen = localStorage.getItem("duelsHelpStatus");
    if (!hasSeen) setShowHelpModal(true);
  }, []);

  const handleSelectAndVote = async (winnerId) => {
    if (isLoading) return;

    setStep((prev) => prev + 1);
    setWinnerId(winnerId);
  };

  useEffect(() => {
    if (isBlocked) {
      confetti({
        particleCount: 300,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isBlocked]);

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

  if (!data?.profiles && !data?.final_winner) {
    return (
      <div className="w-full min-h-[calc(100vh-169px)] flex items-center justify-center">
        <div className="py-16 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <DuelsEmptyIcon />
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Дуэли еще не сформированы
          </h3>

          <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
            Новые дуэли появятся здесь, когда пользователи начнут получать лайки
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col overflow-hidden relative">
      <DuelProgressBar duelsCount={duelsCount} />

      {isBlocked
        ? data?.final_winner && <DuelsWinnerCard winner={data.final_winner} />
        : data?.profiles && (
            <DuelsBattleCards
              profiles={data.profiles}
              isLoading={isLoading}
              isBlocked={isBlocked}
              handleSelectAndVote={handleSelectAndVote}
            />
          )}

      <div className="pb-6 text-center">
        <button
          onClick={() => setShowHelpModal(true)}
          className="text-gray-400 text-sm underline hover:text-gray-600 transition"
        >
          Как это работает?
        </button>
      </div>

      {showHelpModal && <DuelsInformationModal onClose={handleOkHelp} />}
    </div>
  );
};
