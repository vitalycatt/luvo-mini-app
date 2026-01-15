import axios from "axios";
import { decodeJWT } from "./decode-jwt.util";
import { useWebAppStore } from "../store";
import { getAccessToken } from "./get-auth-tokens.util";
import { loginByInitData } from "./login-by-init-data.util";

let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403) {
      const { logout } = useWebAppStore.getState();

      if (window.location.pathname !== "/registration") {
        window.location.href = "/registration";
      }
      logout();
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const errorDetail = error.response.data?.detail;
      if (
        errorDetail === "User not found" ||
        errorDetail === "Invalid token" ||
        errorDetail === "Token expired"
      ) {
        const { logout } = useWebAppStore.getState();
        logout();
        window.location.href = "/";
        return;
      }

      originalRequest._retry = true;

      try {
        const { init, logout, setUser, setInitialized } = useWebAppStore.getState();
        logout();

        const initData = await init();
        if (!initData) throw new Error("initData не получен");

        const data = await loginByInitData(initData);
        const { access_token, has_profile } = data;

        if (!access_token) throw new Error("Токен отсутствует");

        const { exp, user_id } = decodeJWT(access_token);
        setUser({
          id: user_id,
          exp,
          isRegister: has_profile,
          accessToken: access_token,
        });
        setInitialized(true);

        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
