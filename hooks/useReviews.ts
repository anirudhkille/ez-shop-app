import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReviewsByProduct, postReview } from "@/api/reviews";
import { useAuthStore } from "@/store/auth";

export const useReviewsByProductQuery = (productId: string, page = 1) =>
  useQuery({
    queryKey: ["reviews", productId, page],
    queryFn: () => getReviewsByProduct(productId, page),
    enabled: !!productId,
  });

export const usePostReviewMutation = () => {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { product: string; rating: number; comment?: string }) =>
      postReview(token, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", vars.product] });
    },
  });
};
