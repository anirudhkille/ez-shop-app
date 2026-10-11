import { apiClient } from "./client";
import { IApiResponse, IUser, ILogin, ISignUp } from "@/types/api";

export const postSignup = (formData: ISignUp) =>
  apiClient<IApiResponse>("/user/signup", {
    method: "POST",
    body: JSON.stringify({ email: formData.email, password: formData.password }),
  });

export const verifySignupOTP = (email: string, otp: string) =>
  apiClient<IApiResponse & { data: IUser; token: string }>("/user/verify-signup-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });

export const postLogin = (formData: ILogin) =>
  apiClient<IApiResponse<IUser & { token: string }>>("/user/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const forgotPassword = (email: string) =>
  apiClient<IApiResponse>("/user/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (email: string, otp: string, newPassword: string) =>
  apiClient<IApiResponse>("/user/reset-password", {
    method: "PUT",
    body: JSON.stringify({ email, otp, newPassword }),
  });

export const getProfile = (token: string) =>
  apiClient<IApiResponse & { data: IUser }>("/user/profile", {
    token,
  });

export const updateProfile = (token: string, data: { name?: string; phone?: string }) =>
  apiClient<IApiResponse & { data: IUser }>("/user", {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });

export const updatePassword = (token: string, currentPassword: string, newPassword: string) =>
  apiClient<IApiResponse>("/user/password", {
    method: "PUT",
    token,
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const logoutUser = (token: string) =>
  apiClient<IApiResponse>("/user/logout", {
    method: "POST",
    token,
  });

export const refreshToken = () =>
  apiClient<IApiResponse & { token: string }>("/user/refresh", {
    method: "GET",
    credentials: "include",
  });
