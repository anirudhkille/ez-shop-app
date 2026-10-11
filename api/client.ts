import Constants from "expo-constants";

import { useAuthStore } from "@/store/auth";

const resolveApiUrl = (): string => {
  const configured = process.env.EXPO_PUBLIC_API_URL ?? "";

  if (!/^https?:\/\/(localhost|127\.0\.0\.1)/.test(configured)) {
    return configured;
  }

  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  if (!host) return configured;

  return configured.replace(/^(https?:\/\/)(localhost|127\.0\.0\.1)/, `$1${host}`);
};

const API_URL = resolveApiUrl();

export { API_URL };

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiNetworkError";
  }
}

export class ApiAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiAuthError";
  }
}

export async function apiClient<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const isFormData = fetchOptions.body instanceof FormData;
  if (isFormData) {
    delete headers["Content-Type"];
  }

  const url = `${API_URL}${endpoint}`;

  let res: Response;

  try {
    res = await fetch(url, { ...fetchOptions, headers });
  } catch {
    throw new ApiNetworkError(
      `Cannot reach the API at ${API_URL}. Check that the server is running and reachable from this device.`
    );
  }

  const data = await res.json();

  if (!res.ok) {
    // A rejected token means the session is dead. Clearing it here makes the
    // root layout's guard see an empty token and redirect to login, instead of
    // leaving the user on a screen that only shows a failed request.
    if (res.status === 401 && token) {
      useAuthStore.getState().clearAuth();
      throw new ApiAuthError(data.message || "Your session has expired. Please sign in again.");
    }

    throw new Error(data.message || "Something went wrong");
  }

  return data;
}