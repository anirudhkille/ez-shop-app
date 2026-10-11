import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getFilteredProducts,
  getSearchProducts,
  getSimilarProducts,
  getProductById,
} from "@/api/products";

export const useProductsQuery = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });

export const useFeaturedProductsQuery = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: getFeaturedProducts,
  });

export const useBestSellersQuery = () =>
  useQuery({
    queryKey: ["products", "best-sellers"],
    queryFn: getBestSellers,
  });

export const useFilteredProductsQuery = (
  params: Record<string, string>,
  options?: { enabled?: boolean }
) =>
  useQuery({
    queryKey: ["products", "filtered", params],
    queryFn: () => getFilteredProducts(params),
    enabled: (options?.enabled ?? true) && Object.keys(params).length > 0,
  });

export const useSearchProductsQuery = (name: string) =>
  useQuery({
    queryKey: ["products", "search", name],
    queryFn: () => getSearchProducts(name),
    enabled: name.length > 0,
  });

export const useSimilarProductsQuery = (id: string) =>
  useQuery({
    queryKey: ["products", "similar", id],
    queryFn: () => getSimilarProducts(id),
    enabled: !!id,
  });

export const useProductByIdQuery = (slug: string, id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(slug, id),
    enabled: !!id && !!slug,
  });
