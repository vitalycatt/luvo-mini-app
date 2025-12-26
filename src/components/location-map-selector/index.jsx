import { useState, useEffect, useRef } from "react";
import { Spinner } from "@/components";
import { YANDEX_MAPS_API_KEY } from "@/constants";
import { useUpdateUserLocation } from "@/api/locations";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

export const LocationMapSelector = ({
  onSelect,
  onClose,
  initialCoords = null, // [lat, lng] или null
}) => {
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(
    initialCoords || [53.9045, 27.5615] // Минск по умолчанию
  );
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const mapRef = useRef(null);

  const { mutateAsync: updateUserLocation } = useUpdateUserLocation();

  // Обратный геокодинг для получения адреса по координатам
  const geocode = async (coords) => {
    if (!YANDEX_MAPS_API_KEY) {
      console.error("Yandex Maps API key not configured");
      setAddress("Адрес не доступен");
      return;
    }

    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_MAPS_API_KEY}&geocode=${coords[1]},${coords[0]}&format=json&lang=ru_RU`
      );
      const data = await response.json();
      const featureMember =
        data?.response?.GeoObjectCollection?.featureMember?.[0];
      if (featureMember) {
        const address =
          featureMember.GeoObject.metaDataProperty.GeocoderMetaData.text;
        setAddress(address);
      } else {
        setAddress("Адрес не найден");
      }
    } catch (error) {
      console.error("Ошибка геокодинга:", error);
      setAddress("Ошибка определения адреса");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Обработка клика по карте
  const handleMapClick = (e) => {
    const coords = e.get("coords");
    setSelectedCoords(coords);
    geocode(coords);
  };

  // Обработка сохранения
  const handleSave = async () => {
    if (!selectedCoords) return;

    setIsSaving(true);
    try {
      // Отправляем координаты на бэкенд
      // Бэкенд должен определить страну/город/район по координатам
      await updateUserLocation({
        latitude: selectedCoords[0],
        longitude: selectedCoords[1],
      });

      // Вызываем callback если передан
      if (onSelect) {
        onSelect({
          latitude: selectedCoords[0],
          longitude: selectedCoords[1],
          address: address,
        });
      }

      onClose();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert(
        error?.response?.data?.detail ||
          "Не удалось сохранить локацию. Попробуйте еще раз."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Загружаем адрес при первой загрузке, если есть координаты
  useEffect(() => {
    if (selectedCoords && initialCoords) {
      geocode(selectedCoords);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-30 flex flex-col">
      {/* Заголовок */}
      <div className="bg-white dark:bg-black px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 z-10">
        <h2 className="text-lg font-bold">Выберите локацию на карте</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Карта */}
      <div className="flex-1 relative">
        <YMaps query={{ apikey: YANDEX_MAPS_API_KEY, lang: "ru_RU" }}>
          <Map
            defaultState={{
              center: selectedCoords,
              zoom: 12,
            }}
            width="100%"
            height="100%"
            onClick={handleMapClick}
            instanceRef={mapRef}
          >
            {selectedCoords && (
              <Placemark
                geometry={selectedCoords}
                options={{
                  draggable: true,
                  iconLayout: "default#imageWithContent",
                  iconImageHref:
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNGRjM0MzQiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjwvc3ZnPgo=",
                  iconImageSize: [40, 40],
                  iconImageOffset: [-20, -40],
                }}
                onDragEnd={(e) => {
                  const coords = e.get("target").geometry.getCoordinates();
                  setSelectedCoords(coords);
                  geocode(coords);
                }}
              />
            )}
          </Map>
        </YMaps>
      </div>

      {/* Информация о выбранной локации */}
      <div className="bg-white dark:bg-black px-4 py-4 border-t border-gray-200 dark:border-gray-800 z-10">
        {isLoadingAddress ? (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
            <Spinner size="sm" />
            <span className="text-sm">Определение адреса...</span>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Выбранный адрес:
            </p>
            <p className="text-base font-medium dark:text-white">
              {address || "Нажмите на карту для выбора локации"}
            </p>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition font-medium"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedCoords || isSaving}
            className="flex-1 py-3 rounded-lg bg-primary-red hover:bg-primary-red/80 active:bg-primary-red/60 text-white transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Spinner size="sm" />
                <span>Сохранение...</span>
              </>
            ) : (
              "Сохранить"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
