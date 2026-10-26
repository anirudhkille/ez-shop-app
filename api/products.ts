import { apiClient } from "./client";
import { IApiResponse, IProduct, IProductFacets, IPagination } from "@/types/api";

export const getProductById = (slug: string, id: string) =>
  apiClient<IApiResponse<IProduct>>(`/product/${slug}/${id}`);

export const getFilteredProducts = (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  return apiClient<IApiResponse<IProduct[]> & { pagination: IPagination }>(
    `/product/filter?${query}`
  );
};

export const getProductFacets = (params: Record<string, string>) => {
  const query = new URLSearchParams(params).toString();
  return apiClient<IApiResponse<IProductFacets>>(
    `/product/facets${query ? `?${query}` : ""}`
  );
};

export const getSearchProducts = (name: string, limit = 10) =>
  apiClient<IApiResponse<IProduct[]>>(
    `/product/search?name=${encodeURIComponent(name)}&limit=${limit}`
  );

export const getFeaturedProducts = () => apiClient<IApiResponse<IProduct[]>>("/product/featured");

export const getBestSellers = () => apiClient<IApiResponse<IProduct[]>>("/product/best-sellers");

export const getSimilarProducts = (id: string) =>
  apiClient<IApiResponse<IProduct[]>>(`/product/similar/${id}`);
