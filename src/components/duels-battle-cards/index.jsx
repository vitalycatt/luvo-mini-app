import { DuelCard } from "./duel-card";

export const DuelsBattleCards = ({
  isVoting,
  pairData,
  isBlocked,
  selectedUserId,
  handleSelectAndVote,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-4 overflow-hidden flex-1 ${
        isBlocked ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px]">
          <DuelCard
            user={pairData.user}
            onSelect={handleSelectAndVote}
            disabled={isVoting || selectedUserId !== null || isBlocked}
          />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[360px]">
          <DuelCard
            user={pairData.opponent}
            onSelect={handleSelectAndVote}
            disabled={isVoting || selectedUserId !== null || isBlocked}
          />
        </div>
      </div>
    </div>
  );
};
