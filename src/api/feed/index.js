import { API_URL } from "@/constants";
import { queryClient } from "@/main";
import { axiosInstance } from "@/utils/axios.util";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLiked = () =>
  useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`${API_URL}/interactions/like/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

export const useFeeds = (limit = 5, offset = 0, seed = null) => {
  return useQuery({
    queryKey: ["feeds", offset, limit, seed],
    queryFn: async () => {
      const params = { limit, offset };
      if (seed !== null) {
        params.seed = seed;
      }
      const { data } = await axiosInstance.get(`${API_URL}/feed/`, {
        params,
      });
      return data;
    },
  });
};

export const useFeedView = () =>
  useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`${API_URL}/interactions/view/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
