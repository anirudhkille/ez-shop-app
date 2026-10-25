const SUGGEST_URL = "https://api.mapbox.com/search/searchbox/v1/suggest";
const RETRIEVE_URL = "https://api.mapbox.com/search/searchbox/v1/retrieve";

const MIN_QUERY_LENGTH = 3;
const SUGGEST_LIMIT = 6;
const REQUEST_TIMEOUT_MS = 10_000;
const ADDRESS_TYPES = "address,street";

const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "";

export const isMapboxEnabled = Boolean(token);

export interface MapboxSuggestion {
  mapboxId: string;
  primaryText: string;
  secondaryText: string;
}

export interface ResolvedAddress {
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

type MapboxContextLayer = { name?: string; region_code?: string };

type MapboxSuggestResponse = {
  suggestions?: Array<{
    mapbox_id?: string;
    name?: string;
    name_preferred?: string;
    place_formatted?: string;
  }>;
};

type MapboxRetrieveResponse = {
  features?: Array<{
    properties?: {
      name?: string;
      address?: string;
      context?: {
        country?: MapboxContextLayer;
        region?: MapboxContextLayer;
        postcode?: MapboxContextLayer;
        place?: MapboxContextLayer;
        locality?: MapboxContextLayer;
      };
    };
  }>;
};

export const newMapboxSession = () => `ez-shop-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const withSession = (params: URLSearchParams, sessionToken: string) => {
  params.set("session_token", sessionToken);
  params.set("access_token", token);
  return params;
};

const requestJson = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const controller = signal ? null : new AbortController();
  const timer = setTimeout(() => controller?.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: signal ?? controller?.signal,
    });

    if (!response.ok) throw new Error(`Mapbox returned ${response.status}`);

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
};

export const suggestAddresses = async (
  query: string,
  sessionToken: string,
  signal?: AbortSignal
): Promise<MapboxSuggestion[]> => {
  const trimmed = query.trim();
  if (!isMapboxEnabled || trimmed.length < MIN_QUERY_LENGTH) return [];

  const params = withSession(
    new URLSearchParams({
      q: trimmed,
      language: "en",
      country: "in",
      limit: String(SUGGEST_LIMIT),
      types: ADDRESS_TYPES,
    }),
    sessionToken
  );

  const data = await requestJson<MapboxSuggestResponse>(
    `${SUGGEST_URL}?${params.toString()}`,
    signal
  );

  return (data.suggestions ?? [])
    .filter((suggestion) => suggestion.mapbox_id)
    .map((suggestion) => ({
      mapboxId: suggestion.mapbox_id as string,
      primaryText: suggestion.name_preferred ?? suggestion.name ?? "",
      secondaryText: suggestion.place_formatted ?? "",
    }))
    .filter((suggestion) => suggestion.primaryText.length > 0);
};

export const retrieveAddress = async (
  mapboxId: string,
  sessionToken: string
): Promise<ResolvedAddress> => {
  if (!isMapboxEnabled) throw new Error("Address search is not configured");

  const params = withSession(new URLSearchParams(), sessionToken);
  const data = await requestJson<MapboxRetrieveResponse>(
    `${RETRIEVE_URL}/${encodeURIComponent(mapboxId)}?${params.toString()}`
  );

  const properties = data.features?.[0]?.properties;
  if (!properties) throw new Error("Mapbox returned no address details");

  const context = properties.context ?? {};

  return {
    addressLine1: properties.address ?? properties.name ?? "",
    city: context.place?.name ?? context.locality?.name ?? "",
    state: context.region?.name ?? context.region?.region_code ?? "",
    zipCode: context.postcode?.name ?? "",
    country: context.country?.name ?? "India",
  };
};
