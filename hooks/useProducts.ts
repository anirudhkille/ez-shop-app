import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getFeaturedProducts,
  getBestSellers,
  getFilteredProducts,
  getProductFacets,
  getSearchProducts,
  getSimilarProducts,
  getProductById,
} from "@/api/products";

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

/**
 * Endless catalogue for the shop grid.
 *
 * The pages come back as one cached list, so changing a filter simply points
 * the key at a new query instead of the screen having to clear and re-append
 * its own copy of the results.
 */
export const useInfiniteFilteredProductsQuery = (params: Record<string, string>) =>
  useInfiniteQuery({
    queryKey: ["products", "filtered", params],
    queryFn: ({ pageParam }) => getFilteredProducts({ ...params, page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    enabled: Object.keys(params).length > 0,
  });

export const useProductFacetsQuery = (params: Record<string, string>) =>
  useQuery({
    queryKey: ["products", "facets", params],
    queryFn: () => getProductFacets(params),
    staleTime: 60_000,
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
