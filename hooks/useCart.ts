import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartItemCount,
} from "@/api/cart";
import { useAuthStore } from "@/store/auth";

const useToken = () => useAuthStore((s) => s.token);

export const useCartQuery = () => {
  const token = useToken();
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(token),
    enabled: !!token,
  });
};

export const useCartItemCountQuery = () => {
  const token = useToken();
  return useQuery({
    queryKey: ["cart", "count"],
    queryFn: () => getCartItemCount(token),
    enabled: !!token,
  });
};

export const useAddToCartMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      productId: string;
      variantId?: string;
      size?: string;
      quantity?: number;
    }) => addToCart(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartQuantityMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      updateCartQuantity(token, cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCartMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: string) => removeFromCart(token, cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCartMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearCart(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
