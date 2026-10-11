import React from "react";
import { View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";

import { useCategoriesQuery } from "@/hooks/useCategories";
import { useFilteredProductsQuery } from "@/hooks/useProducts";
import { ChevronLeftIcon } from "@/assets/icons/ChevronLeftIcon";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { colors, fonts, radius } from "@/constant/color";
import { IProduct } from "@/types/api";

const CARD_WIDTH = 168;

export default function CategoryProductsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData?.data || [];

  const matches = categories.find((c) => c._id === id) ?? categories.find((c) => c.slug === id);

  // The filter endpoint validates `category` as an ObjectId, so a slug from a
  // deep link has to be resolved before it is sent.
  const categoryId = matches?._id ?? (id?.length === 24 ? id : undefined);

  const { data, isLoading, isError, refetch } = useFilteredProductsQuery(
    { category: categoryId ?? "" },
    { enabled: !!categoryId }
  );

  const products: IProduct[] = data?.data ?? [];
  const title = matches?.name ?? "Category";

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon color={colors.foreground} size={28} />
        </TouchableOpacity>
        <Text size={20} weight="700" variant="displaySemi" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : isError || !categoryId ? (
        <View style={styles.center}>
          <Text align="center" color="muted">
            {categoryId ? "Could not load this category." : "That category no longer exists."}
          </Text>
          {categoryId ? (
            <Button text="Try again" variant="outline" onPress={() => refetch()} />
          ) : null}
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text align="center" color="muted">
            No products in {title} yet.
          </Text>
        </View>
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.75}
              accessibilityRole="button"
              onPress={() => router.push(`/product/${item.slug}/${item._id}`)}
            >
              <View style={styles.imageWrap}>
                <Image source={item.image} style={styles.image} contentFit="contain" />
              </View>
              <View style={styles.cardBody}>
                <Text size={15} weight="600" numberOfLines={2} style={styles.name}>
                  {item.name}
                </Text>
                <Text size={18} weight="700" variant="display" style={styles.price}>
                  {"\u20B9"}
                  {item.discountPrice || item.price}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  title: {
    flex: 1,
    letterSpacing: 0.6,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 32,
  },
  list: {
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  row: {
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
    marginBottom: 12,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    padding: 12,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    padding: 12,
    gap: 4,
  },
  name: {
    fontFamily: fonts.body,
  },
  price: {
    color: colors.brand,
  },
});
