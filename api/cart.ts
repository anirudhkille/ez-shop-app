import { apiClient } from "./client";
import { IApiResponse, ICart } from "@/types/api";

export const getCart = (token: string) =>
  apiClient<IApiResponse<ICart>>("/cart", { token });

export const addToCart = (
  token: string,
  data: { productId: string; variantId?: string; size?: string; quantity?: number },
) =>
  apiClient<IApiResponse<ICart>>("/cart", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });

export const updateCartQuantity = (token: string, cartItemId: string, quantity: number) =>
  apiClient<IApiResponse<ICart>>("/cart", {
    method: "PUT",
    token,
    body: JSON.stringify({ cartItemId, quantity }),
  });

export const removeFromCart = (token: string, cartItemId: string) =>
  apiClient<IApiResponse<ICart>>(`/cart/${cartItemId}`, {
    method: "DELETE",
    token,
  });

export const clearCart = (token: string) =>
  apiClient<IApiResponse>("/cart/clear", { method: "DELETE", token });

export const getCartItemCount = (token: string) =>
  apiClient<IApiResponse & { data: { count: number } }>("/cart/count", { token });
