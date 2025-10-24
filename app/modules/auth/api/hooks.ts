import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authApi} from "@/app/modules/auth/api/index";
import {userApi} from "@/app/modules/user/api";
import {LocalContact} from '../../user/types';

interface LoginParams {
  email: string;
  password: string;
}
// TODO: move all types to separate files

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LoginParams) => authApi.login(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useSyncContacts = () => {
  return useMutation({
    mutationFn: (hashedContacts: LocalContact[]) => userApi.syncContacts(hashedContacts)
  })
}