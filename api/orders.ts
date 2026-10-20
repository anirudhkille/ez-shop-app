import { apiClient } from "./client";
import { IApiResponse, IOrder, IPagination } from "@/types/api";

export const placeCODOrder = (token: string, data: { addressId: string; deliveryMethod: string }) =>
  apiClient<IApiResponse & { orderId: string; redirectUrl: string }>("/order/cod", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });

export const getMyOrders = (token: string, page = 1, limit = 10) =>
  apiClient<IApiResponse<IOrder[]> & { pagintion: IPagination }>(
    `/order/my-orders?page=${page}&limit=${limit}`,
    { token }
  );

export const getOrderById = (token: string, id: string) =>
  apiClient<IApiResponse<IOrder>>(`/order/order-id/${id}`, { token });
