import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import EmptyCart from "@/components/shared/EmptyCart";
import { ShoppingBagIcon } from "@/assets/icons/ShoppingBagIcon";
import { CircleXIcon } from "@/assets/icons/CircleXIcon";
import { MinusIcon } from "@/assets/icons/MinusIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
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

export default function Cart() {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];
  const router = useRouter();

  const { data: cartResponse, isLoading } = useCartQuery();
  const { mutate: updateQuantity } = useUpdateCartQuantityMutation();
  const { mutate: removeFromCart } = useRemoveFromCartMutation();
  const { data: addressesResponse } = useAddressesQuery();
  const { mutate: placeCODOrder, isPending: isPlacingCOD } =
    usePlaceCODOrderMutation();
  const { mutate: createCheckoutSession, isPending: isCreatingSession } =
    useCreateCheckoutSessionMutation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("address");
  const [error, setError] = useState("");

  const cart = (cartResponse as any)?.data;
  const addresses = ((addressesResponse as any)?.data || []) as IAddress[];
  const cartItems = cart?.products || [];

  const openCheckout = () => {
    setSelectedAddressId(
      addresses.find((a: IAddress) => a.isDefault)?._id || null
    );
    setSelectedDelivery("standard");
    setPaymentMethod("cod");
    setCheckoutStep("address");
    setError("");
    bottomSheetRef.current?.expand();
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
          onSuccess: (res) => {
            setCheckoutStep("success");
          },
          onError: (err: any) => {
            setError(err?.message || "Failed to place order");
            setCheckoutStep("payment");
          },
        }
      );
    } else {
      setCheckoutStep("confirming");
      createCheckoutSession(
        { addressId: selectedAddressId, deliveryMethod: selectedDelivery },
        {
          onSuccess: (res: any) => {
            const url = res?.url || res?.data?.url;
            if (url) {
              WebBrowser.openBrowserAsync(url);
            }
            bottomSheetRef.current?.close();
          },
          onError: (err: any) => {
            setError(err?.message || "Failed to create checkout session");
            setCheckoutStep("payment");
          },
        }
      );
    }
  };

  const renderItem = ({ item }: { item: ICartProduct }) => {
    const product = getProduct(item);
    const name = product?.name || "Product";
    const image = product?.image || "";
    const price = item.discountPriceAtPurchase ?? item.priceAtPurchase;
    const itemTotal = price * item.quantity;

    return (
      <View style={[styles.cartItem, { backgroundColor: themeColors.card }]}>
        <Image
          source={image}
          contentFit="cover"
          style={styles.itemImage}
          transition={300}
        />
        <View style={styles.itemDetails}>
          <Text weight="500" size={14} style={{ flex: 1 }}>
            {name}
          </Text>
          {item.size && (
            <Text size={14} color="accent">
              Size: {item.size}
            </Text>
          )}
          <Text weight="600" size={16}>
            ₹{itemTotal.toFixed(2)}
          </Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item, -1)}
              style={[styles.stepperBtn, { borderColor: themeColors.border }]}
            >
              <MinusIcon color={themeColors.primary} size={16} />
            </TouchableOpacity>
            <Text weight="500" size={16} style={styles.stepperQty}>
              {item.quantity}
            </Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item, 1)}
              style={[styles.stepperBtn, { borderColor: themeColors.border }]}
            >
              <PlusIcon color={themeColors.primary} size={16} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          style={styles.deleteBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <CircleXIcon color={themeColors.accent} size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <Container extraStyle={styles.center}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </Container>
    );
  }

  if (!cartItems.length) {
    return (
      <EmptyCart
        text1="Your Bag is empty."
        text2="When you add products, they'll appear here."
        Icon={ShoppingBagIcon}
      />
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.background }]}
      edges={["bottom"]}
    >
      <Container extraStyle={styles.container}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View
              style={[
                styles.summary,
                { borderTopColor: themeColors.border },
              ]}
            >
              <View style={styles.summaryRow}>
                <Text color="accent">Subtotal</Text>
                <Text>₹{(cart?.subtotal || 0).toFixed(2)}</Text>
              </View>
              {(cart?.discountTotal ?? 0) > 0 && (
                <View style={styles.summaryRow}>
                  <Text color="accent">Discount</Text>
                  <Text color="accent">
                    -₹{(cart?.discountTotal || 0).toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text color="accent">Delivery</Text>
                <Text color="accent">
                  {getDeliveryCharge() === 0
                    ? "Free"
                    : `₹${getDeliveryCharge().toFixed(2)}`}
                </Text>
              </View>
              <View
                style={[styles.summaryDivider, { borderColor: themeColors.border }]}
              />
              <View style={styles.summaryRow}>
                <Text weight="600" size={18}>
                  Total
                </Text>
                <Text weight="600" size={18}>
                  ₹{(getTotal()).toFixed(2)}
                </Text>
              </View>
            </View>
          }
        />

        <View style={styles.checkoutBtn}>
          <Button text="Proceed to Checkout" onPress={openCheckout} />
        </View>
      </Container>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["70%"]}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: themeColors.accent }}
        handleStyle={{ backgroundColor: themeColors.background }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView
          style={[styles.sheetContent, { backgroundColor: themeColors.background }]}
        >
          {checkoutStep === "address" && (
            <View style={{ flex: 1 }}>
              <Text weight="600" size={20} style={{ marginBottom: 16 }}>
                Select Address
              </Text>
              {addresses.length === 0 ? (
                <View style={styles.center}>
                  <Text color="accent" align="center">
                    No addresses found. Please add one in your profile.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={addresses}
                  keyExtractor={(a: IAddress) => a._id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const isSelected = selectedAddressId === item._id;
                    return (
                      <TouchableOpacity
                        onPress={() => setSelectedAddressId(item._id)}
                        style={[
                          styles.addressItem,
                          {
                            backgroundColor: themeColors.card,
                            borderColor: isSelected
                              ? themeColors.primary
                              : themeColors.border,
                          },
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                            <Text weight="600">{item.label}</Text>
                            {item.isDefault && (
                              <View style={[styles.defaultBadge, { backgroundColor: themeColors.primary }]}>
                                <Text size={14} color="primary" style={{ color: themeColors.background }}>
                                  Default
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text size={14}>{item.name}</Text>
                          <Text size={14} color="accent">
                            {item.addressLine1}, {item.city}, {item.state} -{" "}
                            {item.zipCode}
                          </Text>
                          <Text size={14} color="accent">
                            {item.phone}
                          </Text>
                        </View>
                        {isSelected && (
                          <CircleCheckIcon color={themeColors.primary} size={22} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  ListFooterComponent={
                    <View style={{ marginTop: "auto", gap: 8 }}>
                      {error ? (
                        <Text color="primary" style={styles.errorText}>
                          {error}
                        </Text>
                      ) : null}
                      <Button
                        text="Continue"
                        onPress={() => setCheckoutStep("delivery")}
                        disabled={!selectedAddressId}
                      />
                    </View>
                  }
                />
              )}
            </View>
          )}

          {checkoutStep === "delivery" && (
            <View style={{ flex: 1 }}>
              <Text weight="600" size={20} style={{ marginBottom: 16 }}>
                Delivery Method
              </Text>
              <View style={{ gap: 12 }}>
                {DELIVERY_OPTIONS.map((opt) => {
                  const isSelected = selectedDelivery === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setSelectedDelivery(opt.key)}
                      style={[
                        styles.deliveryItem,
                        {
                          backgroundColor: themeColors.card,
                          borderColor: isSelected
                            ? themeColors.primary
                            : themeColors.border,
                        },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text weight="600">{opt.label}</Text>
                        <Text size={14} color="accent">
                          {opt.days}
                        </Text>
                      </View>
                      <Text weight="600">
                        {opt.charge === 0 ? "Free" : `₹${opt.charge.toFixed(2)}`}
                      </Text>
                      {isSelected && (
                        <View style={{ marginLeft: 8 }}>
                          <CircleCheckIcon
                            color={themeColors.primary}
                            size={22}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={{ marginTop: "auto", gap: 8 }}>
                <Button
                  text="Continue"
                  onPress={() => setCheckoutStep("payment")}
                />
                <Button
                  text="Back"
                  variant="outline"
                  onPress={() => setCheckoutStep("address")}
                />
              </View>
            </View>
          )}

          {checkoutStep === "payment" && (
            <View style={{ flex: 1 }}>
              <Text weight="600" size={20} style={{ marginBottom: 16 }}>
                Payment Method
              </Text>
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cod")}
                  style={[
                    styles.paymentItem,
                    {
                      backgroundColor: themeColors.card,
                      borderColor:
                        paymentMethod === "cod"
                          ? themeColors.primary
                          : themeColors.border,
                    },
                  ]}
                >
                  <Text weight="500">Cash on Delivery</Text>
                  {paymentMethod === "cod" && (
                    <CircleCheckIcon color={themeColors.primary} size={22} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("card")}
                  style={[
                    styles.paymentItem,
                    {
                      backgroundColor: themeColors.card,
                      borderColor:
                        paymentMethod === "card"
                          ? themeColors.primary
                          : themeColors.border,
                    },
                  ]}
                >
                  <Text weight="500">Pay with Card (Stripe)</Text>
                  {paymentMethod === "card" && (
                    <CircleCheckIcon color={themeColors.primary} size={22} />
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.summary,
                  { borderTopColor: themeColors.border, marginTop: 20 },
                ]}
              >
                <View style={styles.summaryRow}>
                  <Text color="accent">Subtotal</Text>
                  <Text>₹{(cart?.subtotal || 0).toFixed(2)}</Text>
                </View>
                {(cart?.discountTotal ?? 0) > 0 && (
                  <View style={styles.summaryRow}>
                    <Text color="accent">Discount</Text>
                    <Text color="accent">
                      -₹{(cart?.discountTotal || 0).toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text color="accent">Delivery</Text>
                  <Text color="accent">
                    {getDeliveryCharge() === 0
                      ? "Free"
                      : `₹${getDeliveryCharge().toFixed(2)}`}
                  </Text>
                </View>
                <View
                  style={[
                    styles.summaryDivider,
                    { borderColor: themeColors.border },
                  ]}
                />
                <View style={styles.summaryRow}>
                  <Text weight="600" size={18}>
                    Total
                  </Text>
                  <Text weight="600" size={18}>
                    ₹{getTotal().toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: "auto", gap: 8 }}>
                {error ? (
                  <Text color="primary" style={styles.errorText}>
                    {error}
                  </Text>
                ) : null}
                <Button
                  text={
                    paymentMethod === "cod" ? "Place Order (COD)" : "Pay with Card"
                  }
                  onPress={handlePlaceOrder}
                  loading={isPlacingCOD || isCreatingSession}
                />
                <Button
                  text="Back"
                  variant="outline"
                  onPress={() => setCheckoutStep("delivery")}
                />
              </View>
            </View>
          )}

          {checkoutStep === "confirming" && (
            <View style={[styles.center, { flex: 1 }]}>
              <ActivityIndicator size="large" color={themeColors.primary} />
              <Text style={{ marginTop: 16 }} color="accent">
                Processing your order...
              </Text>
            </View>
          )}

          {checkoutStep === "success" && (
            <View style={[styles.center, { flex: 1, gap: 12 }]}>
              <CircleCheckIcon color={themeColors.primary} size={64} />
              <Text weight="600" size={20} align="center">
                Order Placed Successfully!
              </Text>
              <Text color="accent" align="center">
                Thank you for your purchase. You will receive a confirmation
                shortly.
              </Text>
              <View style={{ width: "100%", marginTop: 20 }}>
                <Button
                  text="Continue Shopping"
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    router.push("/shop");
                  }}
                />
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    position: "relative",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  itemDetails: {
    flex: 1,
    gap: 4,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    marginTop: 4,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperQty: {
    minWidth: 36,
    textAlign: "center",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  summary: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryDivider: {
    borderTopWidth: 1,
    marginVertical: 4,
  },
  checkoutBtn: {
    marginTop: 8,
    paddingBottom: 8,
  },
  sheetContent: {
    flex: 1,
    padding: 20,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    gap: 10,
  },
  defaultBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  deliveryItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  errorText: {
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 8,
  },
});
