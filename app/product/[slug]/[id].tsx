import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { colors } from "@/constant/color";
import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Header from "@/layout/Header";
import { HeartIcon } from "@/assets/icons/HeartIcon";
import { useProductByIdQuery, useSimilarProductsQuery } from "@/hooks/useProducts";
import { useToggleWishlistMutation } from "@/hooks/useWishlist";
import { useAddToCartMutation } from "@/hooks/useCart";
import { useReviewsByProductQuery } from "@/hooks/useReviews";

const { width } = useWindowDimensions();

function StarRow({ rating, count }: { rating: number; count?: number }) {
  return (
    <View style={styles.starRow}>
      <Text size={14} color="muted">
        {"★".repeat(Math.round(rating))}
        {"☆".repeat(5 - Math.round(rating))}
      </Text>
      <Text size={14} color="muted">
        {rating.toFixed(1)}
        {count ? ` (${count})` : ""}
      </Text>
    </View>
  );
}

export default function ProductDetail() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const router = useRouter();

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
  const { mutate: addToCart, isPending: cartPending } = useAddToCartMutation();

  const variant = product?.variants?.[selectedVariant];
  const sizes = variant?.sizes || [];
  const displayImage = variant?.images?.[0] || product?.image || "";

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && sizes.length > 0) {
      Toast.show({ type: "error", text1: "Please select a size" });
      return;
    }
    addToCart(
      {
        productId: product._id,
        variantId: variant?._id,
        size: selectedSize,
        quantity,
      },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Added to cart" });
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: err?.message || "Failed to add to cart",
          });
        },
      }
    );
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product._id, {
      onSuccess: () => {
        Toast.show({ type: "success", text1: "Wishlist updated" });
      },
      onError: (err: any) => {
        Toast.show({
          type: "error",
          text1: err?.message || "Failed to update wishlist",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <Container bottomInset extraStyle={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.brand} />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <>
        <Header />
        <Container bottomInset extraStyle={{ justifyContent: "center", alignItems: "center" }}>
          <Text align="center" color="muted">
            Failed to load product.
          </Text>
          <Button text="Go Back" onPress={() => router.back()} />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container bottomInset extraStyle={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.imageWrapper, { backgroundColor: colors.surface }]}>
            <Image
              source={displayImage}
              style={styles.mainImage}
              contentFit="cover"
              transition={300}
            />
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text size={22} weight="600">
                  {product.name}
                </Text>
                {product.tag ? (
                  <View style={[styles.tagBadge, { backgroundColor: colors.brand + "15" }]}>
                    <Text size={14} weight="500">
                      {product.tag}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={handleToggleWishlist}
                disabled={wishlistPending}
                style={[styles.wishlistBtn, { backgroundColor: colors.surface }]}
              >
                <HeartIcon color={colors.brand} size={22} />
              </TouchableOpacity>
            </View>

            <View style={styles.priceRow}>
              <Text size={24} weight="600">
                ₹{product.discountPrice || product.price}
              </Text>
              {product.discountPrice > 0 && (
                <Text size={16} color="muted" style={styles.strikethrough}>
                  ₹{product.price}
                </Text>
              )}
            </View>

            <StarRow rating={product.rating} count={product.reviewsCount} />

            <Text size={16} color="muted" style={styles.description}>
              {product.description}
            </Text>

            {product.variants && product.variants.length > 0 && (
              <View style={styles.variantSection}>
                <Text size={16} weight="600">
                  Color
                </Text>
                <View style={styles.colorRow}>
                  {product.variants.map((v, idx) => (
                    <TouchableOpacity
                      key={v._id || idx}
                      onPress={() => {
                        setSelectedVariant(idx);
                        setSelectedSize("");
                      }}
                      style={[
                        styles.colorCircle,
                        {
                          backgroundColor: v.colorCode || v.color,
                          borderColor: selectedVariant === idx ? colors.brand : colors.border,
                          borderWidth: selectedVariant === idx ? 2.5 : 1,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}

            {sizes.length > 0 && (
              <View style={styles.variantSection}>
                <Text size={16} weight="600">
                  Size
                </Text>
                <View style={styles.sizeRow}>
                  {sizes.map((s) => {
                    const outOfStock = s.stock === 0;
                    return (
                      <TouchableOpacity
                        key={s.size}
                        onPress={() => !outOfStock && setSelectedSize(s.size)}
                        disabled={outOfStock}
                        style={[
                          styles.sizeChip,
                          {
                            backgroundColor:
                              selectedSize === s.size ? colors.brand : colors.surface,
                            borderColor: colors.border,
                            opacity: outOfStock ? 0.35 : 1,
                          },
                        ]}
                      >
                        <Text
                          size={14}
                          weight="500"
                          style={{
                            color: selectedSize === s.size ? colors.background : colors.brand,
                          }}
                        >
                          {s.size}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.quantityRow}>
              <Text size={16} weight="600">
                Quantity
              </Text>
              <View style={[styles.quantityControl, { borderColor: colors.border }]}>
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  style={styles.qtyBtn}
                >
                  <Text size={20} weight="600">
                    -
                  </Text>
                </TouchableOpacity>
                <Text size={18} weight="600">
                  {quantity}
                </Text>
                <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                  <Text size={20} weight="600">
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button text="Add to Cart" onPress={handleAddToCart} loading={cartPending} />
          </View>

          {similarProducts.length > 0 && (
            <View style={styles.section}>
              <Text size={20} weight="600">
                Similar Products
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarScroll}
              >
                {similarProducts.map((p) => (
                  <TouchableOpacity
                    key={p._id}
                    onPress={() => router.replace(`/product/${p.slug}/${p._id}`)}
                    style={[styles.similarCard, { backgroundColor: colors.surface }]}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={p.image}
                      style={styles.similarImage}
                      contentFit="cover"
                      transition={300}
                    />
                    <View style={styles.similarInfo}>
                      <Text size={14} weight="500">
                        {p.name}
                      </Text>
                      <Text size={14} weight="600">
                        ₹{p.discountPrice || p.price}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {reviews.length > 0 && (
            <View style={styles.section}>
              <Text size={20} weight="600">
                Reviews ({reviews.length})
              </Text>
              <View style={styles.reviewsList}>
                {reviews.map((r) => (
                  <View key={r._id} style={[styles.reviewCard, { borderColor: colors.border }]}>
                    <View style={styles.reviewHeader}>
                      <Text size={14} weight="600">
                        {r.user || "Anonymous"}
                      </Text>
                      <StarRow rating={r.rating} />
                    </View>
                    {r.comment ? (
                      <Text size={14} color="muted">
                        {r.comment}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  imageWrapper: {
    width: width,
    height: width,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  detailsSection: {
    padding: 20,
    gap: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tagBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  wishlistBtn: {
    padding: 10,
    borderRadius: 999,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  description: {
    lineHeight: 22,
  },
  variantSection: {
    gap: 10,
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  sizeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sizeChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  section: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  similarScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  similarCard: {
    width: 140,
    borderRadius: 10,
    overflow: "hidden",
  },
  similarImage: {
    width: 140,
    height: 140,
  },
  similarInfo: {
    padding: 8,
    gap: 3,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    gap: 6,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
