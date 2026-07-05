import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  placeCODOrder,
  getMyOrders,
  getOrderById,
  getOrderBySessionId,
} from "@/api/orders";
import { useAuthStore } from "@/store/auth";

const useToken = () => useAuthStore((s) => s.token);

export const useMyOrdersQuery = (page = 1) => {
  const token = useToken();
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => getMyOrders(token, page),
    enabled: !!token,
  });
};

export const useOrderByIdQuery = (id: string) => {
  const token = useToken();
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(token, id),
    enabled: !!token && !!id,
  });
};

export const useOrderBySessionIdQuery = (sessionId: string) =>
  useQuery({
    queryKey: ["order", "session", sessionId],
    queryFn: () => getOrderBySessionId(sessionId),
    enabled: !!sessionId,
  });

export const usePlaceCODOrderMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { addressId: string; deliveryMethod: string }) =>
      placeCODOrder(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
