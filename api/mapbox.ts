import { apiClient } from "./client";
import { IApiResponse, IMapboxSuggestion, IResolvedAddress } from "@/types/api";

const MIN_QUERY_LENGTH = 3;

/** Mapbox bills per session, so a token is minted once per address form. */
export const newMapboxSession = (): string => {
  const cryptoApi = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();

  return `ez-shop-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const suggestAddresses = async (
  query: string,
  sessionToken: string,
  signal?: AbortSignal
): Promise<IMapboxSuggestion[]> => {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];

  const params = new URLSearchParams({ q: trimmed, sessionToken });
  const response = await apiClient<IApiResponse<IMapboxSuggestion[]>>(
    `/mapbox/suggest?${params.toString()}`,
    { signal }
  );

  return response.data ?? [];
};

export const retrieveAddress = async (
  mapboxId: string,
  sessionToken: string
): Promise<IResolvedAddress> => {
  const params = new URLSearchParams({ sessionToken });
  const response = await apiClient<IApiResponse<IResolvedAddress>>(
    `/mapbox/retrieve/${encodeURIComponent(mapboxId)}?${params.toString()}`
  );

  return response.data as IResolvedAddress;
};
