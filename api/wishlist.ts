import { apiClient } from "./client";
import { IApiResponse, IWishlist } from "@/types/api";

export const getWishlist = (token: string) =>
  apiClient<IApiResponse<IWishlist>>("/wishlist", { token });

export const getWishlistDetails = (token: string) =>
  apiClient<IApiResponse<IWishlist>>("/wishlist/details", { token });

export const toggleWishlist = (token: string, productId: string) =>
  apiClient<IApiResponse & { action: "added" | "removed"; data: IWishlist }>(
    "/wishlist/toggle",
    { method: "POST", token, body: JSON.stringify({ productId }) },
  );
