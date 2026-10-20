import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { placeCODOrder, getMyOrders, getOrderById } from "@/api/orders";
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
    // Card orders are only settled by the Stripe webhook, so a pending one is
    // refreshed for a couple of minutes while the customer is looking at it.
    refetchInterval: (query) => {
      const order = query.state.data?.data;

      if (order?.paymentType !== "card" || order.paymentStatus !== "pending") return false;

      return query.state.dataUpdateCount > 40 ? false : 3000;
    },
  });
};

export const usePlaceCODOrderMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { addressId: string; deliveryMethod: string }) => placeCODOrder(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
