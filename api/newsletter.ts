import { apiClient } from "./client";
import { IApiResponse } from "@/types/api";

export const subscribeNewsletter = (email: string) =>
  apiClient<IApiResponse>("/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
