import {useMutation} from "@tanstack/react-query";
import {LocalContact} from "@/app/modules/user/types";
import * as SecureStore from "expo-secure-store";
import {contactsApi} from "@/app/modules/contacts/api/index";

export const useSyncContacts = () => {
  return useMutation({
    mutationFn: (hashedContacts: LocalContact[]) => contactsApi.syncContacts(hashedContacts),
    onSuccess: async (res) => {
      await SecureStore.setItemAsync('contacts', JSON.stringify(res.data))
    }
  })
}