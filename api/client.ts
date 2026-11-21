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

export class ApiNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiNetworkError";
  }
}

/** Proxies return HTML and deletes return no body, so JSON cannot be assumed. */
const readBody = async (res: Response): Promise<any> => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

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

    const body = await readBody(res);
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

export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const doRequest = async (token?: string) => {
    const { token: _ignored, ...fetchOptions } = options;
    const isFormData = fetchOptions.body instanceof FormData;

    const headers = new Headers(fetchOptions.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    try {
      return await fetch(`${API_URL}${endpoint}`, { ...fetchOptions, headers });
    } catch (error) {
      // An abort is a deliberate cancellation, not a connectivity problem.
      if (error instanceof Error && error.name === "AbortError") throw error;
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

  const data = await readBody(res);

  if (!res.ok) {
    // A rejected token means the session is dead. Clearing it here makes the
    // root layout's guard see an empty token and redirect to login, instead of
    // leaving the user on a screen that only shows a failed request.
    if (res.status === 401 && token) {
      useAuthStore.getState().clearAuth();
      throw new ApiAuthError(data?.message || "Your session has expired. Please sign in again.");
    }

    // "Validation failed" alone tells the user nothing; surface the first field.
    const details = data?.data?.details as
      | Array<{ field?: string; message?: string }>
      | undefined;
    const detail = details?.[0];

    if (detail?.message) {
      throw new Error(`${detail.message}${detail.field ? ` (${detail.field})` : ""}`);
    }

    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data as T;
}
