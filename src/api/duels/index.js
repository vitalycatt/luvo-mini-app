import { API_URL } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";

export const useDuelPair = () => {
  return useQuery({
    queryKey: ["duel-pair"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair`);
      return data;
    },
  });
};

export const useDuelNextPair = (winnerId) => {
  return useQuery({
    queryKey: ["duel-pair", winnerId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_URL}/battle/pair`, {
        params: { winner_id: winnerId },
      });
      return data;
    },
    enabled: !!winnerId, // Выполняется только когда winnerId задан
    onSuccess: (data) => {
      // Обновляем основной кэш после успешного запроса
      queryClient.setQueryData(["duel-pair"], data);
    },
  });
};
