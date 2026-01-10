import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import WebApp from "@twa-dev/sdk";
import { useLikes, useMatches } from "@/api/likes";
import {
  Spinner,
  LikesCard,
  EmptyState,
  MetchModal,
  MetchesList,
} from "@/components";
import { Button } from "@/components/ui/button";

export const LikesPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const touchEndX = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const { data: likesData, isLoading: likesIsLoading } = useLikes();
  const { data: metchesData, isLoading: metchesIsLoading } = useMatches();

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (likesData && diff > threshold) {
      setCurrentCardIndex((prev) =>
        prev < likesData.length - 1 ? prev + 1 : prev
      );
    } else if (diff < -threshold) {
      setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const openExternalApp = (url: string) => {
    if (WebApp?.openLink) {
      WebApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const handleJustChatting = () => {
    // Логика перехода в раздел чатов проекта luvo.date
    navigate('/messages'); 
  };

  const isLoading = likesIsLoading || metchesIsLoading;
  const hasLikes = likesData && likesData.length > 0;
  const hasMatches = metchesData && metchesData.length > 0;
  const hasNoData = !isLoading && !hasLikes && !hasMatches;

  return (
    <div className="w-full min-h-[calc(100vh-169px)] flex flex-col items-center justify-start relative pb-64">
      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : hasNoData ? (
        <EmptyState
          title="Пока ничего нет"
          description="Лайки и взаимные симпатии появятся здесь, когда вы начнете получать внимание"
        />
      ) : (
        <div className="w-full max-w-md p-5 overflow-y-auto">
          {/* Секция Лайков */}
          {hasLikes && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Лайки ({likesData.length})
              </h2>
              <div
                className="relative"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <LikesCard card={likesData[currentCardIndex]} />
              </div>
              
              {likesData.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {likesData.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentCardIndex ? "bg-primary-red w-4" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Секция Мэтчей */}
          {hasMatches && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Взаимные симпатии ({metchesData.length})
              </h2>
              <MetchesList metches={metchesData} />
            </div>
          )}
        </div>
      )}

      {/* НИЖНЯЯ ПАНЕЛЬ С КНОПКАМИ GLASS */}
      <div className="fixed bottom-28 left-0 right-0 flex flex-col items-center gap-4 px-6 z-40">
        
        {/* Кнопка Совместимости */}
        <Button 
          variant="glass" 
          size="lg" 
          className="min-w-[220px] w-full max-w-xs"
          onClick={() => openExternalApp('https://mystic-tarot-miniapp.vercel.app/')}
        >
          <Heart className="mr-2 h-5 w-5" />
          проверить совместимость
        </Button>

        {/* Кнопка Чата */}
        <Button 
          variant="glass" 
          size="lg" 
          className="min-w-[220px] w-full max-w-xs"
          onClick={handleJustChatting}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          just chatting
        </Button>
        
      </div>

      {isOpen && <MetchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </div>
  );
};