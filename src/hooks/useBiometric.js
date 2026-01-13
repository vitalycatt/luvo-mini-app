import { useEffect, useState, useCallback } from "react";

/**
 * Хук для работы с Telegram Biometric Manager (Face ID / Touch ID)
 * @returns {Object} Методы и состояние биометрии
 */
export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [isAccessRequested, setIsAccessRequested] = useState(false);
  const [biometricType, setBiometricType] = useState("unknown"); // "face", "finger", "unknown"
  const [biometricToken, setBiometricToken] = useState(null);

  useEffect(() => {
    const biometric = window.Telegram?.WebApp?.BiometricManager;

    if (biometric) {
      setIsAvailable(biometric.isInited && biometric.isBiometricAvailable);
      setIsAccessGranted(biometric.isAccessGranted);
      setIsAccessRequested(biometric.isAccessRequested);
      setBiometricType(biometric.biometricType || "unknown");

      // Инициализируем биометрию, если еще не инициализирована
      if (!biometric.isInited) {
        biometric.init();
      }
    }
  }, []);

  /**
   * Запросить доступ к биометрии (Face ID / Touch ID)
   */
  const requestAccess = useCallback((reason = "Для быстрого входа") => {
    return new Promise((resolve, reject) => {
      const biometric = window.Telegram?.WebApp?.BiometricManager;

      if (!biometric || !biometric.isBiometricAvailable) {
        reject(new Error("Биометрия недоступна на этом устройстве"));
        return;
      }

      biometric.requestAccess(
        { reason },
        (isGranted) => {
          setIsAccessGranted(isGranted);
          setIsAccessRequested(true);
          if (isGranted) {
            resolve(true);
          } else {
            reject(new Error("Доступ к биометрии отклонен"));
          }
        }
      );
    });
  }, []);

  /**
   * Аутентифицировать пользователя через биометрию
   */
  const authenticate = useCallback((reason = "Подтвердите свою личность") => {
    return new Promise((resolve, reject) => {
      const biometric = window.Telegram?.WebApp?.BiometricManager;

      if (!biometric || !biometric.isAccessGranted) {
        reject(new Error("Доступ к биометрии не предоставлен"));
        return;
      }

      biometric.authenticate(
        { reason },
        (isAuthenticated, biometricToken) => {
          if (isAuthenticated) {
            setBiometricToken(biometricToken);
            resolve({ success: true, token: biometricToken });
          } else {
            reject(new Error("Аутентификация не удалась"));
          }
        }
      );
    });
  }, []);

  /**
   * Обновить биометрический токен (при регистрации)
   */
  const updateToken = useCallback((token, reason = "Сохранение данных для быстрого входа") => {
    return new Promise((resolve, reject) => {
      const biometric = window.Telegram?.WebApp?.BiometricManager;

      if (!biometric || !biometric.isAccessGranted) {
        reject(new Error("Доступ к биометрии не предоставлен"));
        return;
      }

      biometric.updateBiometricToken(token, (updated) => {
        if (updated) {
          setBiometricToken(token);
          resolve(true);
        } else {
          reject(new Error("Не удалось обновить токен"));
        }
      });
    });
  }, []);

  /**
   * Открыть настройки биометрии
   */
  const openSettings = useCallback(() => {
    const biometric = window.Telegram?.WebApp?.BiometricManager;
    if (biometric) {
      biometric.openSettings();
    }
  }, []);

  return {
    // Состояние
    isAvailable,
    isAccessGranted,
    isAccessRequested,
    biometricType,
    biometricToken,

    // Методы
    requestAccess,
    authenticate,
    updateToken,
    openSettings,
  };
};
