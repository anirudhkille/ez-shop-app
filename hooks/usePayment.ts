import { useMutation } from "@tanstack/react-query";
import {
  createCheckoutSession,
  createGuestCheckoutSession,
} from "@/api/payment";
import { useAuthStore } from "@/store/auth";

export const useCreateCheckoutSessionMutation = () => {
  const token = useAuthStore((s) => s.token);
  return useMutation({
    mutationFn: (data: { addressId: string; deliveryMethod: string }) =>
      createCheckoutSession(token, data),
  });
};

export const useCreateGuestCheckoutSessionMutation = () =>
  useMutation({
    mutationFn: createGuestCheckoutSession,
  });
