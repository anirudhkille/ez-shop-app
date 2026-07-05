import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWishlist, getWishlistDetails, toggleWishlist } from "@/api/wishlist";
import { useAuthStore } from "@/store/auth";

const useToken = () => useAuthStore((s) => s.token);

export const useWishlistQuery = () => {
  const token = useToken();
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist(token),
    enabled: !!token,
  });
};

export const useWishlistDetailsQuery = () => {
  const token = useToken();
  return useQuery({
    queryKey: ["wishlist", "details"],
    queryFn: () => getWishlistDetails(token),
    enabled: !!token,
  });
};

export const useToggleWishlistMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => toggleWishlist(token, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
