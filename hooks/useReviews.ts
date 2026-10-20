import { useQuery } from "@tanstack/react-query";
import { getReviewsByProduct } from "@/api/reviews";

export const useReviewsByProductQuery = (productId: string, page = 1) =>
  useQuery({
    queryKey: ["reviews", productId, page],
    queryFn: () => getReviewsByProduct(productId, page),
    enabled: !!productId,
  });
