import { useMutation } from "@tanstack/react-query";
import { abandonPaymentIntent, createPaymentIntent } from "@/api/payment";
import { useAuthStore } from "@/store/auth";

export const useCreatePaymentIntentMutation = () => {
  const token = useAuthStore((s) => s.token);
  return useMutation({
    mutationFn: (data: { addressId: string; deliveryMethod: string }) =>
      createPaymentIntent(token, data),
  });
};

export const useAbandonPaymentMutation = () => {
  const token = useAuthStore((s) => s.token);
  return useMutation({
    mutationFn: (orderId: string) => abandonPaymentIntent(token, orderId),
  });
};
