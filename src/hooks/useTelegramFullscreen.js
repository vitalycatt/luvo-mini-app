import { useEffect } from "react";

export const useTelegramFullscreen = () => {
  useEffect(() => {
    // Функция для инициализации fullscreen
    const initializeFullscreen = () => {
      const tg = window.Telegram?.WebApp;

      // Проверяем наличие Telegram WebApp и его инициализацию
      if (!tg || !tg.initData) {
        // В режиме разработки или если WebApp не доступен, просто выходим
        return;
      }

      // Вызываем ready() для уведомления Telegram о готовности приложения
      if (typeof tg.ready === "function") {
        tg.ready();
      }

      // Разворачиваем приложение на весь экран
      try {
        if (typeof tg.expand === "function") {
          tg.expand();
        }
      } catch (err) {
        console.warn("Ошибка при активации fullscreen:", err);
      }

      // Отключаем вертикальные свайпы (чтобы приложение не сворачивалось)
      try {
        if (typeof tg.disableVerticalSwipes === "function") {
          tg.disableVerticalSwipes();
        } else if (typeof tg.setupSwipeBehavior === "function") {
          tg.setupSwipeBehavior({ allow_vertical_swipe: false });
        }
      } catch (err) {
        console.warn("Ошибка при отключении свайпов:", err);
      }
    };

    // Проверяем, загружен ли уже Telegram WebApp
    if (window.Telegram?.WebApp?.initData) {
      initializeFullscreen();
    } else {
      // Если еще не загружен, ждем события загрузки
      const checkInterval = setInterval(() => {
        if (window.Telegram?.WebApp?.initData) {
          clearInterval(checkInterval);
          initializeFullscreen();
        }
      }, 100);

      // Очищаем интервал через 5 секунд, если WebApp так и не загрузился
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
      }, 5000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, []);
};
