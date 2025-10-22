import axios from 'axios';
import {getDeviceId} from "@/app/modules/auth/utils/getDiveceId";
import {getAccessToken, getRefreshToken, saveTokens} from "@/app/modules/auth/utils/tokens";

export const axiosClient = axios.create({
  baseURL: "http://192.168.123.35:3001/api/", //TODO: move to .env
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
    const deviceId = await getDeviceId();

    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    config.headers['x-device-id'] = deviceId;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');
        const res = await axiosClient.post('auth/refresh', {refreshToken});
        const { accessToken: newAccess } = res.data;
        await saveTokens(res.data)

        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);
