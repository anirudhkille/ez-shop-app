import type { ReactNode } from "react";

// Stripe has no web build, so the preview bundle gets inert stand-ins.
export const StripeProvider = ({ children }: { children: ReactNode }) => <>{children}</>;

const unavailable = async () => ({
  error: { code: "Failed" as const, message: "Card payments are only available in the app" },
});

export const useStripe = () => ({
  initPaymentSheet: unavailable,
  presentPaymentSheet: unavailable,
});
