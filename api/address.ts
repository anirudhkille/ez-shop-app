import { apiClient } from "./client";
import { IApiResponse, IAddress } from "@/types/api";

export const getAddresses = (token: string) =>
  apiClient<IApiResponse<IAddress[]>>("/address", { token });

export const createAddress = (token: string, data: Partial<IAddress>) =>
  apiClient<IApiResponse<IAddress>>("/address", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });

export const updateAddress = (token: string, id: string, data: Partial<IAddress>) =>
  apiClient<IApiResponse<IAddress>>(`/address/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });

export const deleteAddress = (token: string, id: string) =>
  apiClient<IApiResponse<IAddress>>(`/address/${id}`, {
    method: "DELETE",
    token,
  });
