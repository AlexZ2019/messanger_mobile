import {LocalContact} from "@/app/modules/user/types";
import {axiosClient} from "@/app/modules/common/api";

export const contactsApi = {
  syncContacts: async (hashedContacts: LocalContact[]): Promise<any> => {
    return axiosClient.post('contacts', hashedContacts, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      }
    });
  }
}