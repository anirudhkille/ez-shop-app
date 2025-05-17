import { ILogin, ISignUp, IResetPassword, IUpdateProfile } from "@/types/api";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const postSignup = async (formData: ISignUp) => {
  const res = await fetch(`${API_URL}/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create account");
  }
  return res.json();
};

export const postLogin = async (formData: ILogin) => {
  const res = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to login");
  }
  return res.json();
};

export const updateProfile = async (formData: IUpdateProfile) => {
  const res = await fetch(`${API_URL}/user`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update profile");
  }
  return res.json();
};