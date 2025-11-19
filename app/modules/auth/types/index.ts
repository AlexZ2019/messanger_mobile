import {User} from "@/app/modules/user/types";

export interface LoginParams {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: User;
  isLoading: boolean;
}