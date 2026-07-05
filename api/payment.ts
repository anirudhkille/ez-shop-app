import { apiClient } from "./client";

export const createCheckoutSession = (
  token: string,
  data: { addressId: string; deliveryMethod: string },
) =>
  apiClient<{ success: boolean; type: string; url: string }>(
    "/payment/create-checkout-session",
    { method: "POST", token, body: JSON.stringify(data) },
  );

export const createGuestCheckoutSession = (data: {
  products: { productId: string; quantity: number }[];
  address: any;
  deliveryMethod: string;
  name: string;
  email: string;
  phone: string;
}) =>
  apiClient<{ success: boolean; type: string; url: string }>(
    "/payment/create-guest-session",
    { method: "POST", body: JSON.stringify(data) },
  );
