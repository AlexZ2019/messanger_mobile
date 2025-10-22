import {axiosClient} from "@/app/modules/common/api";
import {getDeviceId} from "@/app/modules/auth/utils/getDiveceId";
import {clearTokens, saveTokens} from "@/app/modules/auth/utils/tokens";

export const authApi = {
  //TODO: move to user api VV
  me: async (): Promise<{ id: number; email: string; name?: string } | null> => {
    try {
      const { data } = await axiosClient.get('user');

      return data;
    } catch (err: any) {
      if (err.response?.status === 401) return null;
      throw err;
    }
  },

  login: async ({ email, password }: { email: string; password: string }) => {
    const deviceId = await getDeviceId();
    const { data } = await axiosClient.post('auth/login', { email, password });
    const { accessToken, refreshToken } = data;
    await saveTokens({ accessToken, refreshToken });

    return { accessToken, refreshToken, deviceId };
  },

  logout: async () => {
    await axiosClient.post('auth/logout');
    await clearTokens()
  },
};
