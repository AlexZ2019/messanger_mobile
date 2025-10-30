import {axiosClient} from "@/app/modules/common/api";
import {LocalContact} from "@/app/modules/user/types";

export const userApi = {
  getUser: async (): Promise<{ id: number; email: string; name?: string } | null> => {
    try {
      const { data } = await axiosClient.get('user');

      return data;
    } catch (err: any) {
      if (err.response?.status === 401) return null;
      throw err;
    }
  }
}