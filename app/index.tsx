import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";

export default function Index() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(token ? "/home" : "/login");
  }, [hydrated, token, router]);

  return null;
}
