import { apiClient } from "./client";
import { IApiResponse, IOrder, IPagination } from "@/types/api";

export const placeCODOrder = (token: string, data: { addressId: string; deliveryMethod: string }) =>
  apiClient<IApiResponse & { orderId: string; redirectUrl: string }>("/order/cod", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });

export const placeGuestCODOrder = (data: {
  products: { productId: string; quantity: number }[];
  address: any;
  deliveryMethod: string;
  name: string;
  email: string;
  phone: string;
}) =>
  apiClient<IApiResponse & { orderId: string; redirectUrl: string }>("/order/guest", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMyOrders = (token: string, page = 1, limit = 10) =>
  apiClient<IApiResponse<IOrder[]> & { pagintion: IPagination }>(
    `/order/my-orders?page=${page}&limit=${limit}`,
    { token }
  );

export const getOrderById = (token: string, id: string) =>
  apiClient<IApiResponse<IOrder>>(`/order/order-id/${id}`, { token });

export const getOrderBySessionId = (sessionId: string) =>
  apiClient<IApiResponse<IOrder>>(`/order/session-id/${sessionId}`);
