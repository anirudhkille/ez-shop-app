import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth";

export default function Index() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    router.replace(token ? "/(tabs)" : "/login");
  }, [hydrated, token, router]);

  return null;
}
