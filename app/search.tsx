import React, { useEffect, useRef, useState } from "react";
import { FlatList, Platform, StyleSheet, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import Header from "@/layout/Header";
import Container from "@/layout/Container";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/shared/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { colors, fonts, radius } from "@/constant/color";
import { useSearchProductsQuery } from "@/hooks/useProducts";
import { IProduct } from "@/types/api";

export default function SearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(query.trim()), 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const { data, isLoading } = useSearchProductsQuery(debounced);
  const results: IProduct[] = data?.data || [];

  const hasQuery = debounced.length > 0;

  return (
    <>
      <Header title="Search" />

      <Container extraStyle={styles.noPad}>
        <View style={styles.gutter}>
          <View style={styles.field}>
            <SearchIcon color={colors.muted} size={18} />
            <TextInput
              style={[
                styles.input,
                Platform.OS === "web" && ({ outlineStyle: "none" } as object),
              ]}
              placeholder="Search products"
              placeholderTextColor={colors.subtle}
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Search products"
            />
          </View>
        </View>

        {!hasQuery ? (
          <EmptyState
            title="Find something you like"
            body="Search by product name, category or style."
            icon={<SearchIcon color={colors.muted} size={24} />}
            style={styles.empty}
          />
        ) : isLoading ? (
          <View style={styles.skeletonWrap}>
            <ProductGridSkeleton count={4} />
          </View>
        ) : results.length === 0 ? (
          <EmptyState
            title="No results"
            body={`Nothing matches "${debounced}". Try a broader word.`}
            icon={<PackageIcon color={colors.muted} size={24} />}
            actionLabel="Clear search"
            onAction={() => setQuery("")}
          />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item._id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => router.push(`/product/${item.slug}/${item._id}`)}
              />
            )}
          />
        )}
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  gutter: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.foreground,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  skeletonWrap: {
    paddingTop: 4,
  },
  // Keep the hint near the field instead of centring it in the leftover space.
  empty: {
    flex: 0,
    paddingTop: 56,
    paddingBottom: 0,
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
