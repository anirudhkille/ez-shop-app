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

let refreshPromise: Promise<boolean> | null = null;

const requestNewToken = async (): Promise<boolean> => {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}${REFRESH_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client: "app", refreshToken }),
    });

    if (!res.ok) {
      // A rejected refresh token cannot be salvaged; a network error can.
      if (res.status === 401 || res.status === 403) {
        useAuthStore.getState().clearAuth();
      }
      return false;
    }

    const body = await res.json();
    const token: string | undefined = body?.data?.token;
    if (!token) return false;

    // The server rotates on every use, so the new token must be kept.
    useAuthStore.getState().setSession({
      token,
      refreshToken: body?.data?.refreshToken,
    });
    return true;
  } catch {
    return false;
  }
};

/** One shared in-flight refresh; parallel 401s must not rotate twice. */
export const refreshSession = (): Promise<boolean> => {
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
    // Access tokens last 15 minutes; exchange the stored refresh token once
    // and replay the request instead of bouncing the user to login.
    const refreshed = await refreshSession();

    if (refreshed) {
      res = await doRequest(useAuthStore.getState().token);
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

    // "Validation failed" alone tells the user nothing; surface the first field.
    const details = data?.data?.details as
      | Array<{ field?: string; message?: string }>
      | undefined;
    const detail = details?.[0];

    if (detail?.message) {
      throw new Error(`${detail.message}${detail.field ? ` (${detail.field})` : ""}`);
    }

    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
