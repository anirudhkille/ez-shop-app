import { apiClient } from "./client";
import { IApiResponse, IReview, IPagination } from "@/types/api";

export const getReviewsByProduct = (productId: string, page = 1, limit = 10) =>
  apiClient<IApiResponse<IReview[]> & { pagination: IPagination }>(
    `/review/${productId}?page=${page}&limit=${limit}`
  );
