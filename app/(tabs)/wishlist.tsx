import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Container from "@/layout/Container";
import ScreenHeader from "@/components/ui/ScreenHeader";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/shared/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { HeartIcon } from "@/assets/icons/HeartIcon";
import { colors } from "@/constant/color";
import { useWishlistDetailsQuery, useToggleWishlistMutation } from "@/hooks/useWishlist";
import { IProduct } from "@/types/api";

export default function Wishlist() {
  const router = useRouter();
  const { data: wishlistResponse, isLoading } = useWishlistDetailsQuery();
  const { mutate: toggleWishlist } = useToggleWishlistMutation();

  const products: IProduct[] =
    ((wishlistResponse as any)?.data?.products || []).filter(
      (p: any): p is IProduct => typeof p === "object",
    ) || [];

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId, {
      onSuccess: (res: any) => {
        const action = res?.data?.action || res?.action;
        if (action === "removed") Toast.show({ type: "success", text1: "Removed from wishlist" });
        else if (action === "added") Toast.show({ type: "success", text1: "Saved to wishlist" });
      },
      onError: () => Toast.show({ type: "error", text1: "Could not update your wishlist" }),
    });
  };

  const subtitle = isLoading
    ? "Loading"
    : `${products.length} ${products.length === 1 ? "saved item" : "saved items"}`;

  return (
    <Container topInset extraStyle={styles.noPad}>
      <View style={styles.gutter}>
        <ScreenHeader title="Wishlist" subtitle={subtitle} />
      </View>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          body="Tap the heart on any product to keep it here for later."
          icon={<HeartIcon color={colors.muted} size={24} />}
          actionLabel="Browse products"
          onAction={() => router.push("/(tabs)/shop")}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.slug}/${item._id}`)}
              overlayAction={
                <TouchableOpacity
                  onPress={() => handleToggleWishlist(item._id)}
                  style={styles.heart}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.name} from wishlist`}
                >
                  <HeartIcon color={colors.brand} fill={colors.brand} size={16} />
                </TouchableOpacity>
              }
            />
          )}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  gutter: {
    paddingHorizontal: 20,
  },
  row: {
    gap: 12,
    paddingHorizontal: 20,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  heart: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(13,13,13,0.78)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
