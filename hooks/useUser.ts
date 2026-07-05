import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postLogin,
  postSignup,
  verifySignupOTP,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  updatePassword,
  logoutUser,
} from "@/api/user";
import { useAuthStore } from "@/store/auth";

export const useLoginMutation = () => {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      if (data.token) setToken(data.token);
      if (data.data) setUser(data.data);
    },
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: postSignup,
  });
};

export const useVerifySignupOTPMutation = () => {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifySignupOTP(email, otp),
    onSuccess: (data) => {
      if (data.token) setToken(data.token);
      if (data.data) setUser(data.data);
    },
  });
};

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: forgotPassword,
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    }) => resetPassword(email, otp, newPassword),
  });

export const useProfileQuery = () => {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(token),
    enabled: !!token,
  });
};

export const useUpdateProfileMutation = () => {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; phone?: string }) =>
      updateProfile(token, data),
    onSuccess: (data) => {
      if (data.data) setUser(data.data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdatePasswordMutation = () => {
  const token = useAuthStore((s) => s.token);
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => updatePassword(token, currentPassword, newPassword),
  });
};

export const useLogoutMutation = () => {
  const token = useAuthStore((s) => s.token);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutUser(token),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });
};
