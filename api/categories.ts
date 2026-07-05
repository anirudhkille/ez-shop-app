import { apiClient } from "./client";
import { IApiResponse, ICategory } from "@/types/api";

export const getCategories = () =>
  apiClient<IApiResponse<ICategory[]>>("/category");
