import { useState, useEffect } from "react";
import { useWebAppStore } from "@/store";
import { Button } from "@/ui";

export const TelegramInfo = () => {
  const { user, webApp, getPhoneNumber, getShareUrl, getLocation } =
    useWebAppStore();
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone_number || webApp?.initDataUnsafe?.user?.phone_number || null
  );
  const [shareUrl, setShareUrl] = useState(null);
  const [location, setLocation] = useState(user?.location || null);
  const [isRequestingPhone, setIsRequestingPhone] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Получаем share-ссылку при монтировании и при изменении user
    const url = getShareUrl();
    setShareUrl(url);
  }, [getShareUrl, user]);

  useEffect(() => {
    // Обновляем номер телефона, если он появился в user
    if (user?.phone_number) {
      setPhoneNumber(user.phone_number);
    } else if (webApp?.initDataUnsafe?.user?.phone_number) {
      setPhoneNumber(webApp.initDataUnsafe.user.phone_number);
    }

    // Обновляем локацию, если она появилась в user
    if (user?.location) {
      setLocation(user.location);
    }
  }, [user, webApp]);

  const handleRequestPhone = async () => {
    setIsRequestingPhone(true);
    try {
      const phone = await getPhoneNumber();
      if (phone) {
        setPhoneNumber(phone);
      }
    } catch (error) {
      console.error("Ошибка при запросе номера телефона:", error);
    } finally {
      setIsRequestingPhone(false);
    }
  };

  const handleRequestLocation = async () => {
    setIsRequestingLocation(true);
    setLocationError(null);
    try {
      const loc = await getLocation();
      if (loc) {
        setLocation({
          latitude: loc.latitude,
          longitude: loc.longitude,
        });
        setLocationError(null);
      } else {
        setLocationError("Локация не была получена");
      }
    } catch (error) {
      console.error("Ошибка при запросе локации:", error);
      const errorMessage =
        error?.message ||
        error?.toString() ||
        "Неизвестная ошибка при запросе локации";
      setLocationError(errorMessage);
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        if (webApp?.showAlert) {
          webApp.showAlert("Ссылка скопирована!");
        }
      } else {
        // Fallback для старых браузеров
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        if (webApp?.showAlert) {
          webApp.showAlert("Ссылка скопирована!");
        } else {
          alert("Ссылка скопирована!");
        }
      }
    } catch (error) {
      console.error("Ошибка при копировании ссылки:", error);
      if (webApp?.showAlert) {
        webApp.showAlert("Не удалось скопировать ссылку");
      } else {
        alert("Не удалось скопировать ссылку");
      }
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold mb-5">Telegram</h2>

      <div className="space-y-4">
        {/* Номер телефона */}
        <div className="w-full p-4 border-2 border-primary-gray/30 dark:border-white/70 bg-gray-light dark:bg-transparent rounded-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Номер телефона
            </label>

            {phoneNumber ? (
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  {phoneNumber}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Номер телефона не предоставлен
                </p>
                <Button
                  onClick={handleRequestPhone}
                  disabled={isRequestingPhone}
                  styleType="secondary"
                  className="w-full"
                >
                  {isRequestingPhone ? "Запрос..." : "Запросить номер телефона"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Share-ссылка */}
        <div className="w-full p-4 border-2 border-primary-gray/30 dark:border-white/70 bg-gray-light dark:bg-transparent rounded-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Share-ссылка
            </label>

            {shareUrl ? (
              <div className="flex flex-col gap-2">
                <div className="w-full p-3 bg-white dark:bg-gray-800 rounded-xl border border-primary-gray/20 dark:border-white/20">
                  <span className="text-sm text-gray-900 dark:text-white break-all">
                    {shareUrl}
                  </span>
                </div>

                <Button
                  onClick={handleCopyShareUrl}
                  styleType={isCopied ? "primary" : "secondary"}
                  className="w-full mt-2"
                  disabled={isCopied}
                >
                  {isCopied ? "✓ Скопировано!" : "Копировать ссылку"}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Share-ссылка недоступна
              </p>
            )}
          </div>
        </div>

        {/* Локация */}
        <div className="w-full p-4 border-2 border-primary-gray/30 dark:border-white/70 bg-gray-light dark:bg-transparent rounded-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Локация
            </label>
            {location ? (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-900 dark:text-white">
                  Широта: {location.latitude?.toFixed(6)}
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  Долгота: {location.longitude?.toFixed(6)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Локация не предоставлена
                </p>
                <Button
                  onClick={handleRequestLocation}
                  disabled={isRequestingLocation}
                  styleType="secondary"
                  className="w-full"
                >
                  {isRequestingLocation ? "Запрос..." : "Запросить локацию"}
                </Button>
                {locationError && (
                  <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                      Ошибка:
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300 break-all">
                      {locationError}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
