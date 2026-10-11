import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Text as RNText,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { colors, fonts, radius, tagBadge } from "@/constant/color";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { TuneIcon } from "@/assets/icons/TuneIcon";
import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";
import { useFilteredProductsQuery, useSearchProductsQuery } from "@/hooks/useProducts";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { IProduct } from "@/types/api";

type SortOption = "price-low" | "price-high" | "newest" | "rating";
type GenderFilter = "men" | "women" | "unisex" | "all";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price-low" },
  { label: "Price: high to low", value: "price-high" },
  { label: "Top rated", value: "rating" },
];

const GENDER_OPTIONS: { label: string; value: GenderFilter }[] = [
  { label: "Everyone", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
];

const PAGE_SIZE = 10;

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);

  return (
    <View style={styles.starRow}>
      <RNText style={[styles.starGlyph, { color: colors.warning }]}>
        {"\u2605".repeat(filled)}
      </RNText>
      {filled < 5 ? (
        <RNText style={[styles.starGlyph, { color: colors.subtle }]}>
          {"\u2605".repeat(5 - filled)}
        </RNText>
      ) : null}
      <RNText style={styles.starCount}>{rating.toFixed(1)}</RNText>
    </View>
  );
}

function ProductItem({ product, onPress }: { product: IProduct; onPress: () => void }) {
  const badge = product.tag ? tagBadge[product.tag] : undefined;
  const categoryName = typeof product.category === "string" ? "" : (product.category?.name ?? "");
  const onSale = product.discountPrice > 0 && product.discountPrice < product.price;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.discountPrice || product.price} rupees`}
    >
      <View style={styles.imageWrap}>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <RNText style={[styles.badgeText, { color: badge.fg }]}>{product.tag}</RNText>
          </View>
        ) : null}

        <Image source={product.image} style={styles.image} contentFit="contain" transition={180} />

        {onSale ? (
          <View style={styles.savePill}>
            <RNText style={styles.saveText}>
              {Math.round((1 - product.discountPrice / product.price) * 100)}% off
            </RNText>
          </View>
        ) : null}
      </View>

      <View style={styles.cardBody}>
        {categoryName ? (
          <RNText style={styles.eyebrow} numberOfLines={1}>
            {categoryName}
          </RNText>
        ) : null}

        <RNText style={styles.name} numberOfLines={2}>
          {product.name}
        </RNText>

        <View style={styles.priceRow}>
          <RNText style={styles.price}>
            {"\u20B9"}
            {product.discountPrice || product.price}
          </RNText>
          {onSale ? (
            <RNText style={styles.wasPrice}>
              {"\u20B9"}
              {product.price}
            </RNText>
          ) : null}
        </View>

        <Stars rating={product.rating} />
      </View>
    </TouchableOpacity>
  );
}

function ProductGrid({
  products,
  onPressProduct,
  onEndReached,
  footer,
}: {
  products: IProduct[];
  onPressProduct: (product: IProduct) => void;
  onEndReached?: () => void;
  footer?: React.ReactElement | null;
}) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.gridRow}
      contentContainerStyle={styles.gridContent}
      renderItem={({ item }) => <ProductItem product={item} onPress={() => onPressProduct(item)} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListFooterComponent={footer}
      keyboardShouldPersistTaps="handled"
    />
  );
}

function EmptyState({ message, onReset }: { message: string; onReset?: () => void }) {
  return (
    <View style={styles.centerState}>
      <Text align="center" color="muted" size={15}>
        {message}
      </Text>
      {onReset ? (
        <View style={styles.retryWrap}>
          <Button text="Clear filters" variant="outline" onPress={onReset} />
        </View>
      ) : null}
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.centerState}>
      <Text align="center" color="muted" size={15}>
        {message}
      </Text>
      <View style={styles.retryWrap}>
        <Button text="Try again" variant="outline" onPress={onRetry} />
      </View>
    </View>
  );
}

function FilterSheet({
  visible,
  sort,
  gender,
  onClose,
  onChangeSort,
  onChangeGender,
  onClear,
}: {
  visible: boolean;
  sort: SortOption;
  gender: GenderFilter;
  onClose: () => void;
  onChangeSort: (s: SortOption) => void;
  onChangeGender: (g: GenderFilter) => void;
  onClear: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <View style={styles.sheetHeader}>
          <Text size={22} weight="700" variant="displaySemi">
            FILTERS
          </Text>
          <Pressable onPress={onClear} hitSlop={10} accessibilityRole="button">
            <Text size={14} weight="600" color="brand">
              Reset
            </Text>
          </Pressable>
        </View>

        <Text size={12} weight="600" color="muted" style={styles.sheetLabel}>
          SORT BY
        </Text>
        {SORT_OPTIONS.map((opt) => {
          const active = sort === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChangeSort(opt.value)}
              style={styles.sheetRow}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <Text
                size={15}
                color={active ? "foreground" : "muted"}
                weight={active ? "600" : "400"}
              >
                {opt.label}
              </Text>
              {active ? <CircleCheckIcon color={colors.brand} size={20} /> : null}
            </Pressable>
          );
        })}

        <Text size={12} weight="600" color="muted" style={styles.sheetLabel}>
          DEPARTMENT
        </Text>
        {GENDER_OPTIONS.map((opt) => {
          const active = gender === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChangeGender(opt.value)}
              style={styles.sheetRow}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <Text
                size={15}
                color={active ? "foreground" : "muted"}
                weight={active ? "600" : "400"}
              >
                {opt.label}
              </Text>
              {active ? <CircleCheckIcon color={colors.brand} size={20} /> : null}
            </Pressable>
          );
        })}

        <View style={styles.sheetFooter}>
          <Button text="Show results" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default function Shop() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState<string>("");
  const [gender, setGender] = useState<GenderFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<IProduct[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData?.data || [];

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
    isError: searchError,
    error: searchErrorDetail,
    refetch: refetchSearch,
  } = useSearchProductsQuery(debounced);

  const params = useMemo(() => {
    const next: Record<string, string> = { sort, page: String(page), limit: String(PAGE_SIZE) };
    if (category) next.category = category; // ObjectId: the server rejects slugs here
    if (gender !== "all") next.gender = gender;
    return next;
  }, [category, gender, sort, page]);

  const {
    data: filteredData,
    isLoading: filterLoading,
    isFetching: filterFetching,
    isError: filterError,
    error: filterErrorDetail,
    refetch: refetchFiltered,
  } = useFilteredProductsQuery(params);

  const pageItems = useMemo(() => filteredData?.data || [], [filteredData]);
  const pagination = filteredData?.pagination;
  const searchResults = searchData?.data || [];

  // A new filter invalidates everything fetched so far.
  useEffect(() => {
    setAccumulated([]);
    setPage(1);
  }, [category, gender, sort]);

  useEffect(() => {
    if (!pageItems.length) return;
    setAccumulated((prev) => (page === 1 ? pageItems : [...prev, ...pageItems]));
  }, [pageItems, page]);

  const handleQuery = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebounced(text.trim());
      setPage(1);
    }, 350);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const searching = debounced.length > 0;
  const results = searching ? searchResults : accumulated;
  const hasFilters = category !== "" || gender !== "all" || sort !== "newest";

  const total = searching ? searchResults.length : (pagination?.total ?? accumulated.length);
  const shown = searching ? searchResults.length : accumulated.length;

  const busy = searching ? searchFetching : filterFetching;
  const firstLoad = searching ? searchLoading : filterLoading;

  const hasMore = !searching && pagination ? page < pagination.totalPages : false;

  const loadMore = useCallback(() => {
    if (!searching && hasMore && !filterFetching) setPage((p) => p + 1);
  }, [searching, hasMore, filterFetching]);

  const resetAll = useCallback(() => {
    setCategory("");
    setGender("all");
    setSort("newest");
    setQuery("");
    setDebounced("");
    setPage(1);
  }, []);

  const activeCategoryName = categories.find((c) => c._id === category)?.name ?? "";

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.searchField}>
          <SearchIcon color={colors.muted} size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products"
            placeholderTextColor={colors.subtle}
            value={query}
            onChangeText={handleQuery}
            returnKeyType="search"
            autoCorrect={false}
            clearButtonMode="while-editing"
            accessibilityLabel="Search products"
          />
        </View>

        <TouchableOpacity
          onPress={() => setSheetOpen(true)}
          style={styles.filterBtn}
          accessibilityRole="button"
          accessibilityLabel="Filters and sorting"
        >
          <TuneIcon color={hasFilters ? colors.brand : colors.foreground} size={19} />
        </TouchableOpacity>
      </View>

      {!searching && categories.length > 0 ? (
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rail}
          renderItem={({ item }) => {
            const active = category === item._id;
            return (
              <TouchableOpacity
                onPress={() => setCategory(active ? "" : item._id)}
                style={[
                  styles.railChip,
                  active
                    ? { backgroundColor: colors.brand, borderColor: colors.brand }
                    : { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <RNText style={[styles.railText, active && { color: "#FFFFFF" }]} numberOfLines={1}>
                  {item.name}
                </RNText>
              </TouchableOpacity>
            );
          }}
        />
      ) : null}

      <View style={styles.metaRow}>
        <RNText style={styles.metaText} numberOfLines={1}>
          {searching
            ? `${total} ${total === 1 ? "match" : "matches"}`
            : activeCategoryName || "All products"}
        </RNText>
        {!searching && pagination ? (
          <RNText style={styles.metaCount}>
            {firstLoad ? "Loading" : `${shown} of ${pagination.total}`}
          </RNText>
        ) : null}
      </View>

      {firstLoad ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : searching ? (
        searchError ? (
          <ErrorState
            message={String(searchErrorDetail?.message ?? "Search failed")}
            onRetry={() => refetchSearch()}
          />
        ) : results.length === 0 ? (
          <EmptyState
            message={`No products match "${debounced}".`}
            onReset={() => {
              setQuery("");
              setDebounced("");
            }}
          />
        ) : (
          <ProductGrid
            products={results}
            onPressProduct={(p) => router.push(`/product/${p.slug}/${p._id}`)}
          />
        )
      ) : filterError ? (
        <ErrorState
          message={String(filterErrorDetail?.message ?? "Could not load products")}
          onRetry={() => refetchFiltered()}
        />
      ) : results.length === 0 ? (
        <EmptyState
          message={
            hasFilters ? "No products match these filters." : "No products available right now."
          }
          onReset={hasFilters ? resetAll : undefined}
        />
      ) : (
        <ProductGrid
          products={results}
          onPressProduct={(p) => router.push(`/product/${p.slug}/${p._id}`)}
          onEndReached={loadMore}
          footer={
            busy && hasMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={colors.brand} size="small" />
              </View>
            ) : null
          }
        />
      )}

      <FilterSheet
        visible={sheetOpen}
        sort={sort}
        gender={gender}
        onClose={() => setSheetOpen(false)}
        onChangeSort={setSort}
        onChangeGender={setGender}
        onClear={() => {
          setGender("all");
          setSort("newest");
        }}
      />
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
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchField: {
    flex: 1,
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
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontFamily: fonts.body,
    fontSize: 15,
    height: "100%",
  },
  filterBtn: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  rail: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  railChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  railText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  metaText: {
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
    flexShrink: 1,
  },
  metaCount: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },

  gridRow: {
    gap: 12,
    paddingHorizontal: 16,
  },
  gridContent: {
    paddingBottom: 28,
  },

  card: {
    flex: 1,
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
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
    zIndex: 2,
  },
  badgeText: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  savePill: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.destructive,
  },
  saveText: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  cardBody: {
    padding: 12,
    gap: 5,
  },
  eyebrow: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: colors.muted,
  },
  name: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.foreground,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 19,
    fontWeight: "700",
    color: colors.brand,
  },
  wasPrice: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  starGlyph: {
    fontSize: 11,
  },
  starCount: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginLeft: 2,
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  retryWrap: {
    minWidth: 160,
  },
  footerLoader: {
    paddingVertical: 24,
  },

  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
    gap: 2,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sheetLabel: {
    letterSpacing: 1.2,
    marginTop: 14,
    marginBottom: 4,
  },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  sheetFooter: {
    marginTop: 20,
  },
});
