import { DuelCard } from "./duel-card";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

import TelegramIcon from "@/assets/images/telegram.png";
import InstagramIcon from "@/assets/images/instagram.png";

export const DuelsBattleCards = ({
  winner = null,
  isVoting,
  pairData,
  isBlocked = false,
  selectedUserId,
  handleSelectAndVote,
}) => {
  const { handleCopy: handleCopyInstagram, isCopied: isInstagramCopied } =
    useCopyToClipboard(2000);
  const { handleCopy: handleCopyTelegram, isCopied: isTelegramCopied } =
    useCopyToClipboard(2000);

  // Если достигнут лимит и есть победитель, показываем только его
  if (isBlocked && winner) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-4 overflow-hidden flex-1">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px]">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                🏆 Победитель
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ты завершил все сравнения!
              </p>
            </div>

            <DuelCard user={winner} />

            <div className="mt-3">
              {winner.instagram_username && (
                <div className="flex items-center">
                  <img
                    src={InstagramIcon}
                    alt="instagram-icon"
                    className="size-6"
                  />

                  <div
                    className="ml-2 font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() =>
                      handleCopyInstagram(`@${winner.instagram_username}`)
                    }
                  >
                    @{winner.instagram_username}
                  </div>

                  {isInstagramCopied && (
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400 transition-opacity">
                      ✓ Скопировано
                    </span>
                  )}
                </div>
              )}

              {winner.telegram_username && (
                <div className="mt-1 flex items-center">
                  <img
                    src={TelegramIcon}
                    alt="telegram-icon"
                    className="size-6"
                  />

                  <div
                    className="ml-2 font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() =>
                      handleCopyTelegram(`@${winner.telegram_username}`)
                    }
                  >
                    @{winner.telegram_username}
                  </div>

                  {isTelegramCopied && (
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400 transition-opacity">
                      ✓ Скопировано
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Обычный режим - показываем две карточки для выбора
  if (!pairData || pairData.length < 2) {
    return null;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-4 overflow-hidden flex-1 ${
        isBlocked ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <DuelCard
        user={pairData[0]}
        onSelect={handleSelectAndVote}
        disabled={isVoting || selectedUserId !== null || isBlocked}
      />

      <DuelCard
        user={pairData[1]}
        onSelect={handleSelectAndVote}
        disabled={isVoting || selectedUserId !== null || isBlocked}
      />
    </div>
  );
};
