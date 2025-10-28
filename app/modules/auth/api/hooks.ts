import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authApi} from "@/app/modules/auth/api/index";

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