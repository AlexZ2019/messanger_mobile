import {useQuery} from "@tanstack/react-query";
import {userApi} from "@/app/modules/user/api/index";

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: userApi.getUser,
    retry: false,
  });
};