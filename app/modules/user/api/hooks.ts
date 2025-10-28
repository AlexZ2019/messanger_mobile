import {useMutation, useQuery} from "@tanstack/react-query";
import {userApi} from "@/app/modules/user/api/index";
import {LocalContact} from "@/app/modules/user/types";
import * as SecureStore from "expo-secure-store";

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: userApi.getUser,
    retry: false,
  });
};

export const useSyncContacts = () => {
  return useMutation({
    mutationFn: (hashedContacts: LocalContact[]) => userApi.syncContacts(hashedContacts),
    onSuccess: async (res) => {
      await SecureStore.setItemAsync('isContactAsked', 'true')
      await SecureStore.setItemAsync('contacts', res.data)
    }
  })
}