import { useMutation } from "@tanstack/react-query";
import { subscribeNewsletter } from "@/api/newsletter";

export const useSubscribeNewsletterMutation = () =>
  useMutation({
    mutationFn: subscribeNewsletter,
  });
