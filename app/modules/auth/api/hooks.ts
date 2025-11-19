import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authApi} from "@/app/modules/auth/api/index";
import {LoginParams} from "@/app/modules/auth/types";

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