import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Container from "@/layout/container";
import Header from "@/layout/header";
import { ChevronLeftIcon } from "@/assets/icons/chevron-left-icon";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import Badge, { BadgeTone } from "@/components/ui/badge";
import Stars from "@/components/ui/stars";
import SectionHeading from "@/components/ui/section-heading";
import EmptyState from "@/components/ui/empty-state";
import ProductCard from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartIcon } from "@/assets/icons/heart-icon";
import { MinusIcon } from "@/assets/icons/minus-icon";
import { PlusIcon } from "@/assets/icons/plus-icon";
import { PackageIcon } from "@/assets/icons/package-icon";
import { colors, radius } from "@/constant/color";
import { formatPrice, discountPercent } from "@/lib/format";
import { useProductByIdQuery, useSimilarProductsQuery } from "@/hooks/useProducts";
import { useToggleWishlistMutation, useWishlistQuery } from "@/hooks/useWishlist";
import { useAddToCartMutation } from "@/hooks/useCart";
import { useReviewsByProductQuery } from "@/hooks/useReviews";

const TAG_TONE: Record<string, BadgeTone> = {
  New: "brand",
  "Best Seller": "brand",
  Hot: "danger",
  Sale: "success",
  Limited: "warning",
};

export default function ProductDetail() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: productData, isLoading, isError } = useProductByIdQuery(slug, id);
  const product = productData?.data;

  const { data: similarData } = useSimilarProductsQuery(id);
  const similarProducts = similarData?.data || [];

  const { data: reviewsData } = useReviewsByProductQuery(id);
  const reviews = reviewsData?.data || [];

  const { mutate: toggleWishlist, isPending: wishlistPending } = useToggleWishlistMutation();
  const { data: wishlistData } = useWishlistQuery();
  const { mutate: addToCart, isPending: cartPending } = useAddToCartMutation();

  const wishlistIds = (wishlistData?.data?.products ?? []).map((entry: any) =>
    typeof entry === "string" ? entry : entry?._id
  );
  const saved = product ? wishlistIds.includes(product._id) : false;

  const variant = product?.variants?.[selectedVariant];
  const sizes = variant?.sizes || [];
  const displayImage = variant?.images?.[0] || product?.image || "";

  const unitPrice = product
    ? discountPercent(product.price, product.discountPrice)
      ? product.discountPrice
      : product.price
    : 0;
  const saving = product ? discountPercent(product.price, product.discountPrice) : null;

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && sizes.length > 0) {
      Toast.show({ type: "error", text1: "Choose a size first" });
      return;
    }
    addToCart(
      { productId: product._id, variantId: variant?._id, size: selectedSize, quantity },
      {
        onSuccess: () => Toast.show({ type: "success", text1: "Added to cart" }),
        onError: (err: any) =>
          Toast.show({ type: "error", text1: err?.message || "Could not add to cart" }),
      }
    );
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product._id, {
      onSuccess: () =>
        Toast.show({
          type: "success",
          text1: saved ? "Removed from wishlist" : "Saved to wishlist",
        }),
      onError: (err: any) =>
        Toast.show({ type: "error", text1: err?.message || "Could not update wishlist" }),
    });
  };

  if (isLoading) {
    return (
      <>
        <Header title="Product" />
        <Container bottomInset extraStyle={styles.loadingWrap}>
          <Skeleton height={width - 40} rounded={radius.lg} />
          <Skeleton width="70%" height={20} />
          <Skeleton width="40%" height={18} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="90%" height={14} />
        </Container>
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
        <Header title="Product" />
        <Container bottomInset extraStyle={styles.noPad}>
          <EmptyState
            title="Product unavailable"
            body="This product may have sold out or been removed."
            icon={<PackageIcon color={colors.muted} size={24} />}
            actionLabel="Back to shop"
            onAction={() => router.replace("/(tabs)/shop")}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      {/*
        The product hero is the page's own header: a solid bar above it only
        produced a dead band between the status bar and the photograph. The
        container reserves the status-bar inset so the photo and the floating
        back control sit below the clock and battery, and the control floats
        over the image instead.
      */}
      <Stack.Screen options={{ headerShown: false }} />

      <Container topInset bottomInset extraStyle={styles.noPad}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={[styles.imageWrap, { height: width }]}>
            <Image
              source={displayImage}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
              transition={250}
              cachePolicy="memory-disk"
            />

            {product.tag ? (
              <Badge
                label={product.tag}
                tone={TAG_TONE[product.tag] ?? "neutral"}
                style={styles.imageTag}
              />
            ) : null}
          </View>

          <View style={styles.details}>
            <View style={styles.titleRow}>
              <View style={styles.titleText}>
                <Text size={24} weight="700" variant="display" style={styles.name}>
                  {product.name}
                </Text>

                <View style={styles.ratingRow}>
                  <Stars rating={product.rating} reviews={product.reviewsCount} />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleToggleWishlist}
                disabled={wishlistPending}
                style={[styles.wishlistBtn, saved && styles.wishlistBtnActive]}
                accessibilityRole="button"
                accessibilityLabel={saved ? "Remove from wishlist" : "Save to wishlist"}
                accessibilityState={{ selected: saved }}
              >
                <HeartIcon
                  color={saved ? colors.brand : colors.foreground}
                  fill={saved ? colors.brand : "none"}
                  size={20}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.priceRow}>
              <Text size={28} weight="700" variant="display" style={styles.price}>
                {formatPrice(unitPrice)}
              </Text>

              {saving ? (
                <>
                  <Text size={15} color="muted" style={styles.wasPrice}>
                    {formatPrice(product.price)}
                  </Text>
                  <Badge label={`\u2212${saving}%`} tone="success" variant="soft" />
                </>
              ) : null}
            </View>

            {product.description ? (
              <Text size={14} color="muted" style={styles.description}>
                {product.description}
              </Text>
            ) : null}

            {product.variants && product.variants.length > 0 ? (
              <View style={styles.field}>
                <Text size={11} weight="700" color="muted" style={styles.fieldLabel}>
                  Color
                  {variant?.color ? ` \u00B7 ${variant.color}` : ""}
                </Text>

                <View style={styles.colorRow}>
                  {product.variants.map((v, index) => {
                    const active = selectedVariant === index;
                    return (
                      <TouchableOpacity
                        key={v._id || index}
                        onPress={() => {
                          setSelectedVariant(index);
                          setSelectedSize("");
                        }}
                        activeOpacity={0.8}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={v.color}
                        style={[styles.colorRing, active && styles.colorRingActive]}
                      >
                        <View
                          style={[styles.colorDot, { backgroundColor: v.colorCode || v.color }]}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {sizes.length > 0 ? (
              <View style={styles.field}>
                <Text size={11} weight="700" color="muted" style={styles.fieldLabel}>
                  Size
                </Text>

                <View style={styles.sizeRow}>
                  {sizes.map((s) => {
                    const outOfStock = s.stock === 0;
                    const active = selectedSize === s.size;

                    return (
                      <TouchableOpacity
                        key={s.size}
                        onPress={() => !outOfStock && setSelectedSize(s.size)}
                        disabled={outOfStock}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: active, disabled: outOfStock }}
                        style={[
                          styles.sizeChip,
                          active && styles.sizeChipActive,
                          outOfStock && styles.sizeChipDisabled,
                        ]}
                      >
                        <Text
                          size={13}
                          weight="600"
                          style={{
                            color: active
                              ? "#FFFFFF"
                              : outOfStock
                                ? colors.subtle
                                : colors.foreground,
                            lineHeight: 17,
                            flexShrink: 0,
                          }}
                        >
                          {s.size}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text size={11} weight="700" color="muted" style={styles.fieldLabel}>
                Quantity
              </Text>

              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  style={styles.stepperBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease quantity"
                >
                  <MinusIcon color={colors.foreground} size={14} />
                </TouchableOpacity>

                <Text size={15} weight="600" style={styles.stepperValue}>
                  {quantity}
                </Text>

                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  style={styles.stepperBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Increase quantity"
                >
                  <PlusIcon color={colors.foreground} size={14} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {similarProducts.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <SectionHeading title="You may also like" />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.rail}
              >
                {similarProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    variant="rail"
                    width={156}
                    onPress={() => router.replace(`/product/${p.slug}/${p._id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          {reviews.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <SectionHeading title={`Reviews (${reviews.length})`} />
              </View>

              <View style={styles.reviews}>
                {reviews.map((review) => (
                  <View key={review._id} style={styles.reviewCard}>
                    <View style={styles.reviewHead}>
                      <Text size={13} weight="600" numberOfLines={1} style={styles.reviewUser}>
                        {typeof review.user === "object"
                          ? (review.user as any)?.name || "Customer"
                          : "Customer"}
                      </Text>
                      <Stars rating={review.rating} size={11} compact />
                    </View>

                    {review.comment ? (
                      <Text size={13} color="muted" style={styles.reviewBody}>
                        {review.comment}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.bar}>
          <View style={styles.barPrice}>
            <Text size={11} weight="700" color="muted" style={styles.barLabel}>
              Total
            </Text>
            <Text size={22} weight="700" variant="display" style={styles.barValue}>
              {formatPrice(unitPrice * quantity)}
            </Text>
          </View>

          <Button
            text="Add to cart"
            size="lg"
            onPress={handleAddToCart}
            loading={cartPending}
            style={styles.barButton}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.back, { top: insets.top + 20 }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon color={colors.foreground} size={24} />
        </TouchableOpacity>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  loadingWrap: {
    gap: 14,
    paddingTop: 12,
  },
  scroll: {
    paddingBottom: 20,
  },

  imageWrap: {
    width: "100%",
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  imageTag: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 2,
  },
  back: {
    position: "absolute",
    left: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 30,
  },

  details: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 18,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  titleText: {
    flex: 1,
    gap: 6,
  },
  name: {
    letterSpacing: 0.5,
    lineHeight: 28,
    textTransform: "uppercase",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  wishlistBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  wishlistBtnActive: {
    borderColor: "rgba(255,100,10,0.45)",
    backgroundColor: "rgba(255,100,10,0.12)",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  price: {
    letterSpacing: 0.3,
  },
  wasPrice: {
    textDecorationLine: "line-through",
  },
  description: {
    lineHeight: 21,
  },

  field: {
    gap: 10,
  },
  fieldLabel: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  colorRow: {
    flexDirection: "row",
    gap: 10,
  },
  colorRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  colorRingActive: {
    borderColor: colors.brand,
    borderWidth: 2,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  sizeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sizeChip: {
    minWidth: 52,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sizeChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  sizeChipDisabled: {
    opacity: 0.4,
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  stepperBtn: {
    width: 42,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    minWidth: 36,
    textAlign: "center",
  },

  section: {
    marginTop: 28,
    gap: 14,
  },
  sectionHead: {
    paddingHorizontal: 20,
  },
  rail: {
    paddingHorizontal: 20,
    gap: 12,
  },

  reviews: {
    paddingHorizontal: 20,
    gap: 10,
  },
  reviewCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 6,
  },
  reviewHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  reviewUser: {
    flexShrink: 1,
  },
  reviewBody: {
    lineHeight: 19,
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  barPrice: {
    gap: 0,
  },
  barLabel: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  barValue: {
    letterSpacing: 0.3,
  },
  barButton: {
    flex: 1,
  },
});
