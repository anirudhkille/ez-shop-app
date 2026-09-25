import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import Text from "@/components/ui/Text";
import Container from "@/layout/Container";
import { useFilteredProductsQuery, useSearchProductsQuery } from "@/hooks/useProducts";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { IProduct } from "@/types/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 44) / 2;

type SortOption = "price-low" | "price-high" | "newest" | "rating";
type GenderFilter = "men" | "women" | "unisex" | "all";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Price: Low", value: "price-low" },
  { label: "Price: High", value: "price-high" },
  { label: "Newest", value: "newest" },
  { label: "Rating", value: "rating" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      <Text size={14} color="accent">
        {"★".repeat(Math.round(rating))}
        {"☆".repeat(5 - Math.round(rating))}
      </Text>
      <Text size={14} color="accent">
        ({rating.toFixed(1)})
      </Text>
    </View>
  );
}

function ProductItem({ product, onPress }: { product: IProduct; onPress: () => void }) {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.productCard, { backgroundColor: themeColors.card }]}
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
            <Text size={14} color="accent" style={styles.strikethrough}>
              ₹{product.price}
            </Text>
          )}
        </View>
        <StarRating rating={product.rating} />
      </View>
    </TouchableOpacity>
  );
}

export default function Shop() {
  const router = useRouter();
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [gender, setGender] = useState<GenderFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [showSort, setShowSort] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData?.data || [];

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useSearchProductsQuery(debouncedSearch);

  const filterParams: Record<string, string> = {};
  if (selectedCategory) filterParams.category = selectedCategory;
  if (gender !== "all") filterParams.gender = gender;
  filterParams.sort = sort;
  filterParams.page = String(page);
  filterParams.limit = "10";

  const {
    data: filteredData,
    isLoading: filterLoading,
    isFetching: filterFetching,
  } = useFilteredProductsQuery(filterParams);

  const filteredProducts = useMemo(() => filteredData?.data || [], [filteredData]);
  const pagination = filteredData?.pagination;
  const searchResults = searchData?.data || [];

  useEffect(() => {
    if (debouncedSearch) {
      setAllProducts([]);
      setPage(1);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      if (page === 1) {
        setAllProducts(filteredProducts);
      } else {
        setAllProducts((prev) => [...prev, ...filteredProducts]);
      }
    }
  }, [filteredProducts, page]);

  useEffect(() => {
    setAllProducts([]);
    setPage(1);
  }, [selectedCategory, gender, sort]);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 400);
  }, []);

  const isSearchMode = debouncedSearch.length > 0;
  const displayProducts = isSearchMode ? searchResults : allProducts;
  const isLoading = isSearchMode ? searchFetching : filterFetching;
  const isInitialLoading = isSearchMode ? searchLoading : filterLoading && page === 1;
  const hasMore = pagination && !isSearchMode ? page < pagination.totalPages : false;

  const loadMore = useCallback(() => {
    if (!isSearchMode && hasMore && !filterFetching) {
      setPage((prev) => prev + 1);
    }
  }, [isSearchMode, hasMore, filterFetching]);

  const navigateToProduct = (product: IProduct) => {
    router.push(`/product/${product.slug}/${product._id}`);
  };

  return (
    <Container extraStyle={styles.container}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
          },
        ]}
      >
        <TextInput
          style={[styles.searchInput, { color: themeColors.primary }]}
          placeholder="Search products..."
          placeholderTextColor={themeColors.accent}
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {!isSearchMode && (
        <>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(selectedCategory === item.slug ? "" : item.slug)}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      selectedCategory === item.slug ? themeColors.primary : themeColors.card,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <Text
                  size={14}
                  weight="500"
                  color={selectedCategory === item.slug ? "primary" : "primary"}
                  style={{
                    color:
                      selectedCategory === item.slug ? themeColors.background : themeColors.primary,
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.filterRow}>
            {(["all", "men", "women", "unisex"] as GenderFilter[]).map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={[
                  styles.genderChip,
                  {
                    backgroundColor: gender === g ? themeColors.primary : themeColors.card,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <Text
                  size={14}
                  weight="500"
                  style={{
                    color: gender === g ? themeColors.background : themeColors.primary,
                  }}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowSort(!showSort)}
              style={[
                styles.sortButton,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
              ]}
            >
              <Text size={14} weight="500">
                Sort
              </Text>
            </TouchableOpacity>
          </View>

          {showSort && (
            <View
              style={[
                styles.sortDropdown,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
              ]}
            >
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    setSort(opt.value);
                    setShowSort(false);
                  }}
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor:
                        sort === opt.value ? themeColors.primary + "20" : "transparent",
                    },
                  ]}
                >
                  <Text size={14} weight={sort === opt.value ? "600" : "400"}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}

      {isInitialLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      ) : displayProducts.length === 0 ? (
        <View style={styles.centerState}>
          <Text align="center" color="accent">
            No products found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductItem product={item} onPress={() => navigateToProduct(item)} />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoading && page > 1 ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={themeColors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  searchBar: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    fontSize: 15,
  },
  chipsContainer: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  genderChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: "auto",
  },
  sortDropdown: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 20,
  },
  productCard: {
    width: CARD_WIDTH,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  productImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
  },
  productInfo: {
    padding: 8,
    gap: 3,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoader: {
    paddingVertical: 20,
  },
});
