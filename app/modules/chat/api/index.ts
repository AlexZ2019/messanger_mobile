import {axiosClient} from "@/app/modules/common/api";

export const chatApi = {
  getChatId: async (contactId: string) => {
    const { data } = await axiosClient.post(
      'chat',
      { contactId }
    );
    return data;
  },
}