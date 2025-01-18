import { postLogin, postSignup } from "@/api/user";
import { ILogin } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["user"],
    mutationFn: postLogin,
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationKey: ["user"],
    mutationFn: postSignup,
  });
};