import {
  AddressCollectionMode,
  CollectionMode,
} from "@stripe/stripe-react-native";

export { StripeProvider, useStripe } from "@stripe/stripe-react-native";

/**
 * The app already collects the delivery address, so PaymentSheet must not ask
 * for it again. Stripe's own values come from `defaultBillingDetails`.
 */
export const billingCollectionConfig = {
  name: CollectionMode.NEVER,
  phone: CollectionMode.NEVER,
  email: CollectionMode.NEVER,
  address: AddressCollectionMode.NEVER,
  attachDefaultsToPaymentMethod: true,
};
