import {axiosClient} from "@/app/modules/common/api";
import {getDeviceId} from "@/app/modules/auth/utils/getDiveceId";
import {clearTokens, saveTokens} from "@/app/modules/auth/utils/tokens";

export const authApi = {
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
