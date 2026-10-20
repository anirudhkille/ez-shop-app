import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ScreenHeader from "@/components/ui/ScreenHeader";
import EmptyState from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import Sheet from "@/components/shared/Sheet";
import { ShoppingBagIcon } from "@/assets/icons/ShoppingBagIcon";
import { CircleXIcon } from "@/assets/icons/CircleXIcon";
import { MinusIcon } from "@/assets/icons/MinusIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { colors, radius } from "@/constant/color";
import { formatPrice } from "@/lib/format";
import {
  useCartQuery,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
} from "@/hooks/useCart";
import { useAddressesQuery } from "@/hooks/useAddress";
import { usePlaceCODOrderMutation } from "@/hooks/useOrders";
import { useCreateCheckoutSessionMutation } from "@/hooks/usePayment";
import { ICartProduct, IProduct, IAddress } from "@/types/api";

const DELIVERY_OPTIONS = [
  { key: "standard", label: "Standard", charge: 0, days: "7-10 days" },
  { key: "express", label: "Express", charge: 5, days: "3-5 days" },
  { key: "same-day", label: "Same Day", charge: 10, days: "Today" },
];

type CheckoutStep = "address" | "delivery" | "payment" | "confirming" | "success";

function getProduct(item: ICartProduct): IProduct | null {
  if (!item.product) return null;
  if (typeof item.product === "object") return item.product as IProduct;
  return null;
}

/** Selected-state card shared by the address, delivery and payment steps. */
function OptionCard({
  selected,
  onPress,
  children,
  trailing,
}: {
  selected: boolean;
  onPress: () => void;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <View style={styles.optionBody}>{children}</View>
      {trailing ? <View style={styles.optionTrailing}>{trailing}</View> : null}
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function Cart() {
  const router = useRouter();

  const { data: cartResponse, isLoading } = useCartQuery();
  const { mutate: updateQuantity } = useUpdateCartQuantityMutation();
  const { mutate: removeFromCart } = useRemoveFromCartMutation();
  const { data: addressesResponse } = useAddressesQuery();
  const { mutate: placeCODOrder, isPending: isPlacingCOD } = usePlaceCODOrderMutation();
  const { mutate: createCheckoutSession, isPending: isCreatingSession } =
    useCreateCheckoutSessionMutation();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("address");
  const [error, setError] = useState("");

  const cart = (cartResponse as any)?.data;
  const addresses = ((addressesResponse as any)?.data || []) as IAddress[];
  const cartItems: ICartProduct[] = cart?.products || [];

  const openCheckout = () => {
    setSelectedAddressId(addresses.find((a: IAddress) => a.isDefault)?._id || null);
    setSelectedDelivery("standard");
    setPaymentMethod("cod");
    setCheckoutStep("address");
    setError("");
    setCheckoutOpen(true);
  };

  const handleQuantityChange = (item: ICartProduct, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(item._id);
      return;
    }
    updateQuantity({ cartItemId: item._id, quantity: newQty });
  };

  const handleDelete = (itemId: string) => {
    removeFromCart(itemId);
    Toast.show({ type: "success", text1: "Item removed from cart" });
  };

  const getDeliveryCharge = () =>
    DELIVERY_OPTIONS.find((d) => d.key === selectedDelivery)?.charge || 0;

  const getTotal = () => {
    if (!cart) return 0;
    return (cart.subtotal || 0) - (cart.discountTotal || 0) + getDeliveryCharge();
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      setError("Please select an address");
      return;
    }
    setError("");

    if (paymentMethod === "cod") {
      setCheckoutStep("confirming");
      placeCODOrder(
        { addressId: selectedAddressId, deliveryMethod: selectedDelivery },
        {
          onSuccess: () => setCheckoutStep("success"),
          onError: (err: any) => {
            setError(err?.message || "Failed to place order");
            setCheckoutStep("payment");
          },
        },
      );
    } else {
      setCheckoutStep("confirming");
      createCheckoutSession(
        { addressId: selectedAddressId, deliveryMethod: selectedDelivery },
        {
          onSuccess: (res: any) => {
            const url = res?.url || res?.data?.url;
            if (url) WebBrowser.openBrowserAsync(url);
            setCheckoutOpen(false);
          },
          onError: (err: any) => {
            setError(err?.message || "Failed to create checkout session");
            setCheckoutStep("payment");
          },
        },
      );
    }
  };

  /** Shared money block - the sheet and the list footer must match exactly. */
  const summaryRows = (
    <>
      <View style={styles.summaryRow}>
        <Text size={14} color="muted">
          Subtotal
        </Text>
        <Text size={14}>{formatPrice(cart?.subtotal)}</Text>
      </View>

      {(cart?.discountTotal ?? 0) > 0 && (
        <View style={styles.summaryRow}>
          <Text size={14} color="muted">
            Discount
          </Text>
          <Text size={14} color="success">
            {"\u2212"}
            {formatPrice(cart?.discountTotal)}
          </Text>
        </View>
      )}

      <View style={styles.summaryRow}>
        <Text size={14} color="muted">
          Delivery
        </Text>
        <Text size={14} color={getDeliveryCharge() === 0 ? "success" : "foreground"}>
          {getDeliveryCharge() === 0 ? "Free" : formatPrice(getDeliveryCharge())}
        </Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryRow}>
        <Text size={15} weight="600">
          Total
        </Text>
        <Text size={20} weight="700" variant="display" style={styles.totalValue}>
          {formatPrice(getTotal())}
        </Text>
      </View>
    </>
  );

  const renderItem = ({ item }: { item: ICartProduct }) => {
    const product = getProduct(item);
    const name = product?.name || "Product";
    const image = product?.image || "";
    const price = item.discountPriceAtPurchase ?? item.priceAtPurchase;
    const lineTotal = price * item.quantity;

    return (
      <View style={styles.item}>
        <View style={styles.itemImageWrap}>
          <PackageIcon color={colors.borderStrong} size={22} />
          <Image source={image} style={StyleSheet.absoluteFill} contentFit="contain" transition={200} />
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.itemTop}>
            <Text size={15} weight="500" numberOfLines={2} style={styles.itemName}>
              {name}
            </Text>
            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${name} from cart`}
            >
              <CircleXIcon color={colors.subtle} size={18} />
            </TouchableOpacity>
          </View>

          {item.size ? (
            <Text size={12} color="muted">
              Size {item.size}
            </Text>
          ) : null}

          <View style={styles.itemBottom}>
            <View style={styles.stepper}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(item, -1)}
                style={styles.stepperBtn}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
              >
                <MinusIcon color={colors.foreground} size={14} />
              </TouchableOpacity>

              <Text size={14} weight="600" style={styles.stepperQty}>
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => handleQuantityChange(item, 1)}
                style={styles.stepperBtn}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <PlusIcon color={colors.foreground} size={14} />
              </TouchableOpacity>
            </View>

            <Text size={17} weight="700" variant="display" style={styles.lineTotal}>
              {formatPrice(lineTotal)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <Container topInset extraStyle={styles.noPad}>
        <View style={styles.gutter}>
          <ScreenHeader title="Cart" />
        </View>
        <ListSkeleton count={3} />
      </Container>
    );
  }

  if (!cartItems.length) {
    return (
      <Container topInset extraStyle={styles.noPad}>
        <View style={styles.gutter}>
          <ScreenHeader title="Cart" subtitle="0 items" />
        </View>
        <EmptyState
          title="Your bag is empty"
          body="Once you add something, it will show up here ready to check out."
          icon={<ShoppingBagIcon color={colors.muted} size={24} />}
          actionLabel="Start shopping"
          onAction={() => router.push("/(tabs)/shop")}
        />
      </Container>
    );
  }

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Container topInset extraStyle={styles.noPad}>
      <View style={styles.gutter}>
        <ScreenHeader
          title="Cart"
          subtitle={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <View style={styles.summary}>
            <Text size={11} weight="700" color="muted" style={styles.summaryLabel}>
              Order summary
            </Text>
            {summaryRows}
          </View>
        }
      />

      <View style={styles.footer}>
        <Button text="Proceed to checkout" size="lg" onPress={openCheckout} />
      </View>

      <Sheet visible={checkoutOpen} onClose={() => setCheckoutOpen(false)} heightRatio={0.78}>
        <View style={styles.sheetContent}>
          {checkoutStep === "address" && (
            <>
              <SheetTitle title="Delivery address" step="1 of 3" />

              {addresses.length === 0 ? (
                <View style={styles.sheetEmpty}>
                  <Text color="muted" align="center">
                    No saved addresses yet.
                  </Text>
                  <Button
                    text="Add an address"
                    variant="outline"
                    size="sm"
                    onPress={() => {
                      setCheckoutOpen(false);
                      router.push("/profile/add-address");
                    }}
                  />
                </View>
              ) : (
                <FlatList
                  data={addresses}
                  keyExtractor={(a: IAddress) => a._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.sheetList}
                  renderItem={({ item }) => (
                    <OptionCard
                      selected={selectedAddressId === item._id}
                      onPress={() => setSelectedAddressId(item._id)}
                    >
                      <View style={styles.addressHead}>
                        <Text size={14} weight="600">
                          {item.label}
                        </Text>
                        {item.isDefault ? (
                          <Badge label="Default" tone="brand" variant="soft" />
                        ) : null}
                      </View>
                      <Text size={13} color="muted">
                        {[item.addressLine1, item.city, item.state].filter(Boolean).join(", ")}
                        {item.zipCode ? ` ${item.zipCode}` : ""}
                      </Text>
                      {item.phone ? (
                        <Text size={13} color="muted">
                          {item.phone}
                        </Text>
                      ) : null}
                    </OptionCard>
                  )}
                />
              )}

              <View style={styles.sheetFooter}>
                {error ? <Text color="destructive" align="center" size={13}>{error}</Text> : null}
                <Button
                  text="Continue"
                  onPress={() => setCheckoutStep("delivery")}
                  disabled={!selectedAddressId}
                />
              </View>
            </>
          )}

          {checkoutStep === "delivery" && (
            <>
              <SheetTitle title="Delivery method" step="2 of 3" />

              <View style={styles.sheetList}>
                {DELIVERY_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.key}
                    selected={selectedDelivery === opt.key}
                    onPress={() => setSelectedDelivery(opt.key)}
                    trailing={
                      <Text size={14} weight="600" color={opt.charge === 0 ? "success" : "foreground"}>
                        {opt.charge === 0 ? "Free" : formatPrice(opt.charge)}
                      </Text>
                    }
                  >
                    <Text size={15} weight="600">
                      {opt.label}
                    </Text>
                    <Text size={13} color="muted">
                      {opt.days}
                    </Text>
                  </OptionCard>
                ))}
              </View>

              <View style={styles.sheetFooter}>
                <Button text="Continue" onPress={() => setCheckoutStep("payment")} />
                <Button
                  text="Back"
                  variant="ghost"
                  size="sm"
                  onPress={() => setCheckoutStep("address")}
                />
              </View>
            </>
          )}

          {checkoutStep === "payment" && (
            <>
              <SheetTitle title="Payment" step="3 of 3" />

              <View style={styles.sheetList}>
                <OptionCard
                  selected={paymentMethod === "cod"}
                  onPress={() => setPaymentMethod("cod")}
                >
                  <Text size={15} weight="600">
                    Cash on delivery
                  </Text>
                  <Text size={13} color="muted">
                    Pay the courier when it arrives
                  </Text>
                </OptionCard>

                <OptionCard
                  selected={paymentMethod === "card"}
                  onPress={() => setPaymentMethod("card")}
                >
                  <Text size={15} weight="600">
                    Card
                  </Text>
                  <Text size={13} color="muted">
                    Secure checkout with Stripe
                  </Text>
                </OptionCard>
              </View>

              <View style={styles.sheetSummary}>{summaryRows}</View>

              <View style={styles.sheetFooter}>
                {error ? <Text color="destructive" align="center" size={13}>{error}</Text> : null}
                <Button
                  text={paymentMethod === "cod" ? "Place order" : "Pay now"}
                  onPress={handlePlaceOrder}
                  loading={isPlacingCOD || isCreatingSession}
                />
                <Button
                  text="Back"
                  variant="ghost"
                  size="sm"
                  onPress={() => setCheckoutStep("delivery")}
                />
              </View>
            </>
          )}

          {checkoutStep === "confirming" && (
            <View style={styles.sheetCenter}>
              <ActivityIndicator color={colors.brand} />
              <Text color="muted">Placing your order…</Text>
            </View>
          )}

          {checkoutStep === "success" && (
            <View style={styles.sheetCenter}>
              <CircleCheckIcon color={colors.brand} size={56} />
              <Text size={22} weight="700" variant="display" align="center" style={styles.successTitle}>
                Order placed
              </Text>
              <Text color="muted" align="center">
                We have sent a confirmation. You can follow it from My orders.
              </Text>
              <Button
                text="Keep shopping"
                style={styles.successButton}
                onPress={() => {
                  setCheckoutOpen(false);
                  router.push("/(tabs)/shop");
                }}
              />
            </View>
          )}
        </View>
      </Sheet>
    </Container>
  );
}

function SheetTitle({ title, step }: { title: string; step: string }) {
  return (
    <View style={styles.sheetHeader}>
      <Text size={22} weight="700" variant="display" style={styles.sheetTitle}>
        {title}
      </Text>
      <Text size={12} color="muted">
        {step}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  gutter: {
    paddingHorizontal: 20,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },

  item: {
    flexDirection: "row",
    gap: 14,
    padding: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  itemImageWrap: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  itemDetails: {
    flex: 1,
    gap: 5,
    justifyContent: "space-between",
  },
  itemTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  itemName: {
    flex: 1,
    lineHeight: 19,
  },
  itemBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 2,
  },
  lineTotal: {
    letterSpacing: 0.3,
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  stepperBtn: {
    width: 32,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperQty: {
    minWidth: 30,
    textAlign: "center",
  },

  summary: {
    marginTop: 8,
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 8,
  },
  summaryLabel: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  totalValue: {
    letterSpacing: 0.3,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  sheetTitle: {
    letterSpacing: 0.8,
    textTransform: "uppercase",
    lineHeight: 26,
  },
  sheetList: {
    gap: 10,
    paddingBottom: 8,
  },
  sheetEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  sheetFooter: {
    marginTop: "auto",
    paddingTop: 14,
    gap: 8,
  },
  sheetSummary: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: 8,
  },
  sheetCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  successTitle: {
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  successButton: {
    marginTop: 10,
    alignSelf: "stretch",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.brand,
  },
  optionBody: {
    flex: 1,
    gap: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTrailing: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: colors.brand,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand,
  },
  addressHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
