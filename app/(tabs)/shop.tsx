import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, radius } from "@/constant/color";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader, { headerIconButton } from "@/components/ui/ScreenHeader";
import ProductCard from "@/components/shared/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { TuneIcon } from "@/assets/icons/TuneIcon";
import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { useFilteredProductsQuery, useSearchProductsQuery } from "@/hooks/useProducts";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { titleCase } from "@/lib/format";
import { IProduct } from "@/types/api";

type SortOption = "price-low" | "price-high" | "newest" | "rating";
type GenderFilter = "men" | "women" | "unisex" | "all";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest first", value: "newest" },
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
  const groups = [
    { label: "Sort by", options: SORT_OPTIONS, active: sort, onSelect: onChangeSort },
    {
      label: "Department",
      options: GENDER_OPTIONS,
      active: gender,
      onSelect: onChangeGender,
    },
  ] as const;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} accessibilityLabel="Close filters" />

      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <View style={styles.sheetHeader}>
          <Text size={22} weight="700" variant="display" style={styles.sheetTitle}>
            Filters
          </Text>
          <TouchableOpacity onPress={onClear} hitSlop={10} accessibilityRole="button">
            <Text size={14} weight="600" color="brand">
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        {groups.map((group) => (
          <View key={group.label}>
            <Text size={11} weight="700" color="muted" style={styles.sheetLabel}>
              {group.label}
            </Text>

            {group.options.map((option) => {
              const active = group.active === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => group.onSelect(option.value as never)}
                  style={styles.sheetRow}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                >
                  <Text
                    size={15}
                    color={active ? "foreground" : "muted"}
                    weight={active ? "600" : "400"}
                  >
                    {option.label}
                  </Text>
                  {active ? <CircleCheckIcon color={colors.brand} size={20} /> : null}
                </Pressable>
              );
            })}
          </View>
        ))}

        <View style={styles.sheetFooter}>
          <Button text="Show results" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default function Shop() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
    [],
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
  const filterCount = (category ? 1 : 0) + (gender !== "all" ? 1 : 0) + (sort !== "newest" ? 1 : 0);
  const openProduct = (product: IProduct) => router.push(`/product/${product.slug}/${product._id}`);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.top}>
        <View style={styles.headerPad}>
          <ScreenHeader
            title="Shop"
            subtitle={
              firstLoad
                ? "Loading the catalogue"
                : searching
                  ? `${total} ${total === 1 ? "match" : "matches"} for "${debounced}"`
                  : `${total} products`
            }
            right={
              <TouchableOpacity
                onPress={() => setSheetOpen(true)}
                style={[headerIconButton, hasFilters && styles.filterBtnActive]}
                accessibilityRole="button"
                accessibilityLabel="Filters and sorting"
              >
                <TuneIcon color={hasFilters ? colors.brand : colors.foreground} size={19} />
              </TouchableOpacity>
            }
          />
        </View>

        <View style={[styles.searchRow, styles.headerPad]}>
          <View style={styles.searchField}>
            <SearchIcon color={colors.muted} size={18} />
            <TextInput
              style={[
                styles.searchInput,
                Platform.OS === "web" && ({ outlineStyle: "none" } as object),
              ]}
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

          {hasFilters ? <Badge label={`${filterCount} active`} tone="brand" variant="soft" /> : null}
        </View>

        {!searching && categories.length > 0 ? (
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
            ListHeaderComponent={
              <Chip
                label="All"
                active={category === ""}
                onPress={() => setCategory("")}
                style={styles.railItem}
              />
            }
            renderItem={({ item }) => (
              <Chip
                label={titleCase(item.name)}
                active={category === item._id}
                onPress={() => setCategory(category === item._id ? "" : item._id)}
                style={styles.railItem}
              />
            )}
          />
        ) : null}

        {!searching ? (
          <View style={[styles.metaRow, styles.headerPad]}>
            <Text size={14} weight="600" numberOfLines={1} style={styles.metaText}>
              {activeCategoryName || "All products"}
            </Text>
            {pagination ? (
              <Text size={12} color="muted" numberOfLines={1}>
                {firstLoad ? "" : `Showing ${shown} of ${pagination.total}`}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {firstLoad ? (
        <ProductGridSkeleton count={4} />
      ) : searching ? (
        searchError ? (
          <EmptyState
            title="Search failed"
            body="We could not reach the catalogue. Check your connection and try again."
            icon={<PackageIcon color={colors.muted} size={24} />}
            actionLabel="Try again"
            onAction={() => refetchSearch()}
          />
        ) : results.length === 0 ? (
          <EmptyState
            title="No matches"
            body={`Nothing matches "${debounced}". Try a different word or browse the categories.`}
            icon={<SearchIcon color={colors.muted} size={24} />}
            actionLabel="Clear search"
            onAction={() => {
              setQuery("");
              setDebounced("");
            }}
          />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item._id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={() => openProduct(item)} />
            )}
          />
        )
      ) : filterError ? (
        <EmptyState
          title="Could not load products"
          body="The catalogue did not respond. Give it another go."
          icon={<PackageIcon color={colors.muted} size={24} />}
          actionLabel="Try again"
          onAction={() => refetchFiltered()}
        />
      ) : results.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          body={
            hasFilters
              ? "No products match these filters. Try widening your search."
              : "No products are published right now. Check back soon."
          }
          icon={<PackageIcon color={colors.muted} size={24} />}
          actionLabel={hasFilters ? "Clear filters" : undefined}
          onAction={hasFilters ? resetAll : undefined}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => openProduct(item)} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            busy && hasMore ? <Text color="subtle" align="center" style={styles.footerText}>Loading more</Text> : null
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
  top: {
    paddingTop: 0,
  },
  headerPad: {
    paddingHorizontal: 16,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 14,
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
  filterBtnActive: {
    borderColor: colors.brand,
  },

  rail: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  railItem: {
    flexShrink: 0,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 12,
  },
  metaText: {
    flexShrink: 1,
  },

  gridRow: {
    gap: 12,
    paddingHorizontal: 16,
  },
  gridContent: {
    gap: 12,
    paddingBottom: 28,
  },
  footerText: {
    paddingVertical: 20,
  },

  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.68)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sheetTitle: {
    letterSpacing: 0.8,
    textTransform: "uppercase",
    lineHeight: 26,
  },
  sheetLabel: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 2,
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
