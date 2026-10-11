import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import Toast from "react-native-toast-message";
import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import EmptyCart from "@/components/shared/EmptyCart";
import Sheet from "@/components/shared/Sheet";
import { HeartIcon } from "@/assets/icons/HeartIcon";
import { colors } from "@/constant/color";
import { useWishlistDetailsQuery, useToggleWishlistMutation } from "@/hooks/useWishlist";
import { useAddToCartMutation } from "@/hooks/useCart";
import { IProduct } from "@/types/api";

export default function Wishlist() {
  const { data: wishlistResponse, isLoading } = useWishlistDetailsQuery();
  const { mutate: toggleWishlist } = useToggleWishlistMutation();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCartMutation();

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const products: IProduct[] =
    ((wishlistResponse as any)?.data?.products || []).filter(
      (p: any): p is IProduct => typeof p === "object"
    ) || [];

  const handleItemPress = (product: IProduct) => {
    setSelectedProduct(product);
    setSheetOpen(true);
  };

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId, {
      onSuccess: (res: any) => {
        const action = res?.data?.action || res?.action;
        if (action === "removed") {
          Toast.show({ type: "success", text1: "Removed from wishlist" });
        } else if (action === "added") {
          Toast.show({ type: "success", text1: "Added to wishlist" });
        }
      },
      onError: () => {
        Toast.show({ type: "error", text1: "Failed to update wishlist" });
      },
    });
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(
      { productId: selectedProduct._id, quantity: 1 },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: `${selectedProduct.name} added to cart`,
          });
          setSheetOpen(false);
          setSelectedProduct(null);
        },
        onError: () => {
          Toast.show({ type: "error", text1: "Failed to add to cart" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container extraStyle={styles.center}>
        <ActivityIndicator size="large" color={colors.brand} />
      </Container>
    );
  }

  if (!products.length) {
    return (
      <EmptyCart
        text1="Your Wishlist is empty."
        text2="Save your favorite items and they'll appear here."
        Icon={HeartIcon}
      />
    );
  }

  const price = (p: IProduct) => p.discountPrice ?? p.price;

  return (
    <Container extraStyle={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        scrollEnabled
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemPress(item)}
            style={[styles.itemContainer, { backgroundColor: colors.background }]}
          >
            <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
              <Image contentFit="cover" source={item.image} style={styles.image} transition={300} />
              <TouchableOpacity
                onPress={() => handleToggleWishlist(item._id)}
                style={[styles.heart, { backgroundColor: colors.background }]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <HeartIcon color={colors.brand} fill={colors.brand} size={18} />
              </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
              <Text weight="500" size={14}>
                {item.name.length > 40 ? item.name.slice(0, 40) + "..." : item.name}
              </Text>
              <Text size={14} color="muted">
                ₹{price(item).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.listContent}
      />

      <Sheet
        visible={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setSelectedProduct(null);
        }}
        heightRatio={0.5}
      >
        <View style={styles.sheetBody}>
          {selectedProduct && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <Image
                  source={selectedProduct.image}
                  contentFit="cover"
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 12,
                    backgroundColor: colors.surface,
                  }}
                />
                <View style={{ flex: 1, gap: 6 }}>
                  <Text weight="600" size={18}>
                    {selectedProduct.name}
                  </Text>
                  {selectedProduct.discountPrice ? (
                    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                      <Text weight="600" size={18}>
                        ₹{selectedProduct.discountPrice.toFixed(2)}
                      </Text>
                      <Text size={14} color="muted" style={{ textDecorationLine: "line-through" }}>
                        ₹{selectedProduct.price.toFixed(2)}
                      </Text>
                    </View>
                  ) : (
                    <Text weight="600" size={18}>
                      ₹{selectedProduct.price.toFixed(2)}
                    </Text>
                  )}
                  <Text size={14} color="muted">
                    {selectedProduct.description?.slice(0, 100)}
                    {selectedProduct.description?.length > 100 ? "..." : ""}
                  </Text>
                </View>
              </View>

              <Button text="Add to Cart" onPress={handleAddToCart} loading={isAddingToCart} />
            </>
          )}
        </View>
      </Sheet>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 999,
  },
  textContainer: {
    padding: 10,
    alignItems: "flex-start",
    gap: 5,
  },
  sheetBody: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
});
