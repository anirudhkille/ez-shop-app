import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import ScreenHeader, { headerIconButton } from "@/components/ui/ScreenHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import PromoBanner from "@/components/shared/PromoBanner";
import { ShoppingBagIcon } from "@/assets/icons/ShoppingBagIcon";
import { colors, radius } from "@/constant/color";
import { titleCase } from "@/lib/format";
import { useFeaturedProductsQuery, useBestSellersQuery } from "@/hooks/useProducts";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { IProduct, ICategory } from "@/types/api";

const GUTTER = 16;
const GRID_GAP = 12;
const COLUMNS = 3;
const RAIL_CARD = 164;

function CategoryTile({
  category,
  width,
  onPress,
}: {
  category: ICategory;
  width: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.categoryTile, { width }]}
      accessibilityRole="button"
      accessibilityLabel={`${category.name} category`}
    >
      <View style={[styles.categoryImageWrap, { height: width }]}>
        <Image
          source={category.image}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      </View>

      <View style={styles.categoryLabel}>
        <Text size={12} weight="700" variant="display" numberOfLines={1} style={styles.categoryName}>
          {titleCase(category.name)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: featuredData,
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useFeaturedProductsQuery();
  const {
    data: bestSellersData,
    isLoading: bestSellersLoading,
    refetch: refetchBestSellers,
  } = useBestSellersQuery();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategoriesQuery();

  const featured = featuredData?.data || [];
  const bestSellers = bestSellersData?.data || [];
  const categories = categoriesData?.data || [];

  const tileWidth = (width - GUTTER * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchBestSellers(), refetchCategories()]);
    setRefreshing(false);
  }, [refetchFeatured, refetchBestSellers, refetchCategories]);

  const openProduct = (product: IProduct) => router.push(`/product/${product.slug}/${product._id}`);

  const loading = featuredLoading && bestSellersLoading && categoriesLoading;

  return (
    <Container topInset extraStyle={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />
        }
      >
        <View style={styles.gutter}>
          <ScreenHeader
            title="EZ Shop"
            eyebrow="Everything, delivered"
            right={
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/cart")}
                style={headerIconButton}
                accessibilityRole="button"
                accessibilityLabel="Open cart"
              >
                <ShoppingBagIcon color={colors.foreground} />
              </TouchableOpacity>
            }
          />
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.brand} />
          </View>
        ) : (
          <>
            <View style={styles.gutter}>
              <PromoBanner onPress={() => router.push("/(tabs)/shop")} />
            </View>

            {categories.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.gutter}>
                  <SectionHeading title="Shop by category" />
                </View>

                <View style={[styles.categoryGrid, styles.gutter]}>
                  {categories.map((category) => (
                    <CategoryTile
                      key={category._id}
                      category={category}
                      width={tileWidth}
                      onPress={() => router.push(`/category/${category._id}`)}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {featured.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.gutter}>
                  <SectionHeading
                    title="Featured"
                    action="See all"
                    onPressAction={() => router.push("/(tabs)/shop")}
                  />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.rail}
                >
                  {featured.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      variant="rail"
                      width={RAIL_CARD}
                      onPress={() => openProduct(product)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {bestSellers.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.gutter}>
                  <SectionHeading
                    title="Best sellers"
                    action="See all"
                    onPressAction={() => router.push("/(tabs)/shop")}
                  />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.rail}
                >
                  {bestSellers.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      variant="rail"
                      width={RAIL_CARD}
                      onPress={() => openProduct(product)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {featured.length === 0 && bestSellers.length === 0 && categories.length === 0 ? (
              <View style={styles.loading}>
                <Text align="center" color="muted">
                  Nothing to show yet. Pull down to refresh.
                </Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  gutter: {
    paddingHorizontal: GUTTER,
  },
  section: {
    marginTop: 30,
    gap: 14,
  },
  rail: {
    paddingHorizontal: GUTTER,
    gap: GRID_GAP,
    paddingBottom: 2,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  categoryTile: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  categoryImageWrap: {
    width: "100%",
    backgroundColor: colors.surfaceRaised,
  },
  categoryLabel: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  categoryName: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  loading: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});
