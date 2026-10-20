import { apiClient } from "./client";

export interface PaymentIntentDetails {
  type: string;
  orderId: string;
  clientSecret: string;
  amount: number;
}

export const createPaymentIntent = (
  token: string,
  data: { addressId: string; deliveryMethod: string }
) =>
  apiClient<{ success: boolean; message: string; data: PaymentIntentDetails }>(
    "/payment/create-payment-intent",
    {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }
  );

export const abandonPaymentIntent = (token: string, orderId: string) =>
  apiClient<{ success: boolean; data: { abandoned: boolean } }>("/payment/abandon", {
    method: "POST",
    token,
    body: JSON.stringify({ orderId }),
  });
