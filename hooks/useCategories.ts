import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories";

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
