import {axiosClient} from "@/app/modules/common/api";
import {User} from "@/app/modules/user/types";

export const userApi = {
  getUser: async (): Promise<User | null> => {
    try {
      const { data } = await axiosClient.get('user');

      return data;
    } catch (err: any) {
      if (err.response?.status === 401) return null;
      throw err;
    }
  }
}