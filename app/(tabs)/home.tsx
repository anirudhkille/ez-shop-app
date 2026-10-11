import React, { useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import PromoBanner from "@/components/shared/PromoBanner";
import { colors } from "@/constant/color";
import { useFeaturedProductsQuery, useBestSellersQuery } from "@/hooks/useProducts";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { IProduct, ICategory } from "@/types/api";

const { width } = useWindowDimensions();
const CARD_WIDTH = width * 0.55;
const CATEGORY_SIZE = (width - 60) / 2;

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      <Text size={14} color="muted">
        {"★".repeat(Math.round(rating))}
        {"☆".repeat(5 - Math.round(rating))}
      </Text>
      <Text size={14} color="muted">
        {rating.toFixed(1)}
      </Text>
    </View>
  );
}

function ProductCard({ product, onPress }: { product: IProduct; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.productCard, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
    >
      <Image
        source={product.image}
        style={styles.productImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.productInfo}>
        <Text size={14} weight="500">
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text size={16} weight="600">
            ₹{product.discountPrice || product.price}
          </Text>
          {product.discountPrice > 0 && (
            <Text size={14} color="muted" style={styles.strikethrough}>
              ₹{product.price}
            </Text>
          )}
        </View>
        <StarRating rating={product.rating} />
      </View>
    </TouchableOpacity>
  );
}

function CategoryCard({ category, onPress }: { category: ICategory; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.categoryCard, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
    >
      <Image
        source={category.image}
        style={styles.categoryImage}
        contentFit="cover"
        transition={300}
      />
      <Text size={14} weight="500" align="center">
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function Home() {
  const router = useRouter();
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchBestSellers(), refetchCategories()]);
    setRefreshing(false);
  }, [refetchFeatured, refetchBestSellers, refetchCategories]);

  const navigateToProduct = (product: IProduct) => {
    router.push(`/product/${product.slug}/${product._id}`);
  };

  const navigateToCategory = (category: ICategory) => {
    router.push(`/category/${category._id}`);
  };

  if (featuredLoading && bestSellersLoading && categoriesLoading) {
    return (
      <Container
        extraStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.brand} />
      </Container>
    );
  }

  return (
    <Container extraStyle={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />
        }
      >
        <View style={styles.section}>
          <PromoBanner onPress={() => router.push("/(tabs)/shop")} />
        </View>

        {featured.length > 0 && (
          <View style={styles.section}>
            <Text size={22} weight="700" variant="displaySemi" style={styles.sectionTitle}>
              FEATURED
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {featured.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPress={() => navigateToProduct(product)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {categories.length > 0 && (
          <View style={styles.section}>
            <Text size={22} weight="600">
              Categories
            </Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onPress={() => navigateToCategory(category)}
                />
              ))}
            </View>
          </View>
        )}

        {bestSellers.length > 0 && (
          <View style={styles.section}>
            <Text size={22} weight="700" variant="displaySemi" style={styles.sectionTitle}>
              BEST SELLERS
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {bestSellers.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPress={() => navigateToProduct(product)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {featured.length === 0 && bestSellers.length === 0 && categories.length === 0 && (
          <View style={styles.emptyState}>
            <Text align="center" color="muted">
              No products available right now.
            </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    letterSpacing: 1,
  },
  section: {
    marginBottom: 28,
  },
  horizontalScroll: {
    paddingVertical: 12,
    gap: 12,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
  },
  productImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
  },
  productInfo: {
    padding: 10,
    gap: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  categoryCard: {
    width: CATEGORY_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    paddingBottom: 10,
  },
  categoryImage: {
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: "center",
  },
});
