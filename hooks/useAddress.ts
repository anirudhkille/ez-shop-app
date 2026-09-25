import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "@/api/address";
import { useAuthStore } from "@/store/auth";
import { IAddress } from "@/types/api";

const useToken = () => useAuthStore((s) => s.token);

export const useAddressesQuery = () => {
  const token = useToken();
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => getAddresses(token),
    enabled: !!token,
  });
};

export const useCreateAddressMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<IAddress>) => createAddress(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};

export const useUpdateAddressMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IAddress> }) =>
      updateAddress(token, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};

export const useDeleteAddressMutation = () => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
};
