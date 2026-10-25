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

// Mirrors lib/stripe.tsx; the web checkout sheet never opens PaymentSheet.
export const billingCollectionConfig = {
  name: "never",
  phone: "never",
  email: "never",
  address: "never",
  attachDefaultsToPaymentMethod: true,
} as const;
