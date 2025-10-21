import {axiosClient} from "@/app/modules/common/api";

export const authApi = {
  me: () => axiosClient.get('/auth/me').then(res => res.data),
  login: (data: { email: string; password: string }) => axiosClient.post('/auth/login', data),
  logout: () => axiosClient.post('/auth/logout'),
};
