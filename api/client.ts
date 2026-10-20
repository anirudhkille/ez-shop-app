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

const REFRESH_PATH = "/user/refresh-token";

/**
 * Single in-flight refresh. Several screens can fire requests at the same
 * moment when the access token has just expired; without this they would each
 * ask for a new token and all but one would fail.
 */
let refreshPromise: Promise<string | null> | null = null;

const requestNewToken = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${API_URL}${REFRESH_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) return null;

    const body = await res.json();
    const token: string | undefined = body?.data?.token;
    return token ?? null;
  } catch {
    return null;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = requestNewToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export async function apiClient<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const doRequest = async (token?: string) => {
    const { token: _ignored, ...fetchOptions } = options;

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

    try {
      return await fetch(`${API_URL}${endpoint}`, { ...fetchOptions, headers });
    } catch {
      throw new ApiNetworkError(
        `Cannot reach the API at ${API_URL}. Check that the server is running and reachable from this device.`
      );
    }
  };

  const { token } = options;
  let res = await doRequest(token);

  if (!res.ok && res.status === 401 && token) {
    // The access token lives for 15 minutes. Rather than dropping the user back
    // to the login screen mid-session, exchange the refresh cookie once and
    // replay the request.
    const fresh = await refreshAccessToken();

    if (fresh) {
      useAuthStore.getState().setToken(fresh);
      res = await doRequest(fresh);
    }
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
