import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Header from "@/layout/Header";
import Container from "@/layout/Container";
import Text from "@/components/ui/Text";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/shared/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { colors } from "@/constant/color";
import { titleCase } from "@/lib/format";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { useFilteredProductsQuery } from "@/hooks/useProducts";
import { IProduct } from "@/types/api";

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
    { enabled: !!categoryId },
  );

  const products: IProduct[] = data?.data ?? [];
  const name = matches?.name ?? "Category";

  return (
    <>
      <Header title={titleCase(name)} />

      <Container bottomInset extraStyle={styles.noPad}>
        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : isError || !categoryId ? (
          <EmptyState
            title={categoryId ? "Could not load category" : "Category not found"}
            body={
              categoryId
                ? "The catalogue did not respond. Give it another go."
                : "This category may have been renamed or removed."
            }
            icon={<PackageIcon color={colors.muted} size={24} />}
            actionLabel={categoryId ? "Try again" : "Browse all products"}
            onAction={categoryId ? () => refetch() : () => router.push("/(tabs)/shop")}
          />
        ) : products.length === 0 ? (
          <EmptyState
            title={`Nothing in ${name} yet`}
            body="We are restocking this category. Browse everything else in the meantime."
            icon={<PackageIcon color={colors.muted} size={24} />}
            actionLabel="Browse all products"
            onAction={() => router.push("/(tabs)/shop")}
          />
        ) : (
          <>
            <View style={styles.countRow}>
              <Text size={13} color="muted">
                {products.length} {products.length === 1 ? "product" : "products"}
              </Text>
            </View>

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
                  showCategory={false}
                  onPress={() => router.push(`/product/${item.slug}/${item._id}`)}
                />
              )}
            />
          </>
        )}
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  countRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  row: {
    gap: 12,
    paddingHorizontal: 20,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
});
