import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  View,
  FlatList,
  ScrollView,
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
import {
  useInfiniteFilteredProductsQuery,
  useProductFacetsQuery,
  useSearchProductsQuery,
} from "@/hooks/useProducts";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { formatPrice, titleCase } from "@/lib/format";
import { ICategory, IProduct, IProductFacets } from "@/types/api";

type SortOption = "price-low" | "price-high" | "newest" | "rating";
type GenderFilter = "men" | "women" | "unisex" | "all";

interface ShopFilters {
  categories: string[];
  sizes: string[];
  colors: string[];
  minRating: number;
  /** `null` means "whatever the catalogue tops out at", so it follows the facets. */
  priceMax: number | null;
  gender: GenderFilter;
  sort: SortOption;
}

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

const DEFAULT_FILTERS: ShopFilters = {
  categories: [],
  sizes: [],
  colors: [],
  minRating: 0,
  priceMax: null,
  gender: "all",
  sort: "newest",
};

const PRICE_STEP = 500;
const PAGE_SIZE = 10;

/** Rounds the catalogue's top price up to the slider's step, as the web storefront does. */
function priceCeiling(max?: number): number {
  if (!max || max <= 0) return PRICE_STEP;
  return Math.max(PRICE_STEP, Math.ceil(max / PRICE_STEP) * PRICE_STEP);
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function OptionRow({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.sheetRow}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
    >
      <Text size={15} color={active ? "foreground" : "muted"} weight={active ? "600" : "400"}>
        {label}
      </Text>
      {active ? <CircleCheckIcon color={colors.brand} size={20} /> : null}
    </Pressable>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text size={11} weight="700" color="muted" style={styles.sheetLabel}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function PriceSlider({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [width, setWidth] = useState(0);

  const update = (x: number) => {
    if (!width) return;
    const ratio = Math.min(1, Math.max(0, x / width));
    const snapped = Math.round((ratio * max) / PRICE_STEP) * PRICE_STEP;
    onChange(Math.min(max, Math.max(PRICE_STEP, snapped)));
  };

  const percent = max > 0 ? (value / max) * 100 : 100;

  return (
    <View
      style={styles.slider}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(event) => update(event.nativeEvent.locationX)}
      onResponderMove={(event) => update(event.nativeEvent.locationX)}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: PRICE_STEP, max, now: value }}
    >
      <View pointerEvents="none" style={styles.sliderRail} />
      <View pointerEvents="none" style={[styles.sliderFill, { width: `${percent}%` }]} />
      <View pointerEvents="none" style={[styles.sliderThumb, { left: `${percent}%` }]} />
    </View>
  );
}

function FilterSheet({
  visible,
  filters,
  categories,
  facets,
  ceiling,
  onClose,
  onChange,
  onClear,
}: {
  visible: boolean;
  filters: ShopFilters;
  categories: ICategory[];
  facets?: IProductFacets;
  ceiling: number;
  onClose: () => void;
  onChange: (filters: ShopFilters) => void;
  onClear: () => void;
}) {
  const sizes = facets?.sizes ?? [];
  const colorOptions = facets?.colors ?? [];
  const ratings = facets?.ratings ?? [];
  const hasPrice = (facets?.price.max ?? 0) > 0;
  const activePrice = Math.min(filters.priceMax ?? ceiling, ceiling);

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

        <ScrollView
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <FilterGroup title="Sort by">
            {SORT_OPTIONS.map((option) => (
              <OptionRow
                key={option.value}
                label={option.label}
                active={filters.sort === option.value}
                onPress={() => onChange({ ...filters, sort: option.value })}
              />
            ))}
          </FilterGroup>

          {categories.length > 0 ? (
            <FilterGroup title="Category">
              <View style={styles.chipWrap}>
                {categories.map((category) => (
                  <Chip
                    key={category._id}
                    label={titleCase(category.name)}
                    active={filters.categories.includes(category._id)}
                    onPress={() =>
                      onChange({
                        ...filters,
                        categories: toggle(filters.categories, category._id),
                      })
                    }
                  />
                ))}
              </View>
            </FilterGroup>
          ) : null}

          {hasPrice ? (
            <FilterGroup title="Price">
              <View style={styles.priceRow}>
                <Text size={13} color="muted">
                  {formatPrice(0)}
                </Text>
                <Text size={14} weight="600">
                  {formatPrice(activePrice)}
                </Text>
              </View>
              <PriceSlider
                value={activePrice}
                max={ceiling}
                onChange={(value) => onChange({ ...filters, priceMax: value })}
              />
            </FilterGroup>
          ) : null}

          {sizes.length > 0 ? (
            <FilterGroup title="Size">
              <View style={styles.chipWrap}>
                {sizes.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    active={filters.sizes.includes(size)}
                    onPress={() => onChange({ ...filters, sizes: toggle(filters.sizes, size) })}
                  />
                ))}
              </View>
            </FilterGroup>
          ) : null}

          {colorOptions.length > 0 ? (
            <FilterGroup title="Colour">
              <View style={styles.colorWrap}>
                {colorOptions.map((color) => {
                  const active = filters.colors.includes(color.label);
                  return (
                    <Pressable
                      key={color.label}
                      onPress={() =>
                        onChange({ ...filters, colors: toggle(filters.colors, color.label) })
                      }
                      style={styles.colorItem}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={color.label}
                    >
                      <View style={[styles.colorRing, active && styles.colorRingActive]}>
                        <View style={[styles.colorDot, { backgroundColor: color.hex }]} />
                      </View>
                      <Text
                        size={11}
                        weight={active ? "600" : "400"}
                        color={active ? "foreground" : "muted"}
                        numberOfLines={1}
                      >
                        {titleCase(color.label)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FilterGroup>
          ) : null}

          {ratings.length > 0 ? (
            <FilterGroup title="Rating">
              <View style={styles.chipWrap}>
                {ratings.map((rating) => (
                  <Chip
                    key={rating}
                    label={`${rating}★ & up`}
                    active={filters.minRating === rating}
                    onPress={() =>
                      onChange({
                        ...filters,
                        minRating: filters.minRating === rating ? 0 : rating,
                      })
                    }
                  />
                ))}
              </View>
            </FilterGroup>
          ) : null}

          <FilterGroup title="Department">
            {GENDER_OPTIONS.map((option) => (
              <OptionRow
                key={option.value}
                label={option.label}
                active={filters.gender === option.value}
                onPress={() => onChange({ ...filters, gender: option.value })}
              />
            ))}
          </FilterGroup>
        </ScrollView>

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
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: categoriesData } = useCategoriesQuery();
  const categories = categoriesData?.data || [];

  const facetParams = useMemo<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    if (filters.categories.length) next.category = filters.categories.join(",");
    return next;
  }, [filters.categories]);
  const { data: facetsData } = useProductFacetsQuery(facetParams);
  const facets = facetsData?.data;
  const ceiling = priceCeiling(facets?.price.max);
  const priceNarrowed = (filters.priceMax ?? ceiling) < ceiling;
  const activePrice = Math.min(filters.priceMax ?? ceiling, ceiling);

  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
    isError: searchError,
    refetch: refetchSearch,
  } = useSearchProductsQuery(debounced);

  // `page` is deliberately absent: the infinite query appends it per request,
  // so changing a filter starts a fresh key instead of mutating a page counter.
  const params = useMemo(() => {
    const next: Record<string, string> = { sort: filters.sort, limit: String(PAGE_SIZE) };
    if (filters.categories.length) next.category = filters.categories.join(",");
    if (filters.gender !== "all") next.gender = filters.gender;
    if (filters.sizes.length) next.size = filters.sizes.join(",");
    if (filters.colors.length) next.color = filters.colors.join(",");
    if (filters.minRating > 0) next.minRating = String(filters.minRating);
    if (priceNarrowed) next.price = `0-${activePrice}`;
    return next;
  }, [filters, priceNarrowed, activePrice]);

  const {
    data: filteredData,
    isLoading: filterLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError: filterError,
    refetch: refetchFiltered,
  } = useInfiniteFilteredProductsQuery(params);

  const pageItems = useMemo(
    () => filteredData?.pages.flatMap((page) => page.data ?? []) ?? [],
    [filteredData],
  );
  const pagination = filteredData?.pages[0]?.pagination;
  const searchResults = searchData?.data || [];

  const handleQuery = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebounced(text.trim());
    }, 350);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const searching = debounced.length > 0;
  const results = searching ? searchResults : pageItems;

  const filterCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.minRating > 0 ? 1 : 0) +
    (priceNarrowed ? 1 : 0) +
    (filters.gender !== "all" ? 1 : 0) +
    (filters.sort !== "newest" ? 1 : 0);
  const hasFilters = filterCount > 0;

  const total = searching ? searchResults.length : (pagination?.total ?? pageItems.length);
  const shown = results.length;

  const busy = searching ? searchFetching : isFetchingNextPage;
  const firstLoad = searching ? searchLoading : filterLoading;

  const hasMore = !searching && !!hasNextPage;

  const loadMore = useCallback(() => {
    if (!searching && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [searching, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const resetAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
    setDebounced("");
  }, []);

  const metaLabel =
    filters.categories.length === 0
      ? "All products"
      : filters.categories.length === 1
        ? titleCase(categories.find((item) => item._id === filters.categories[0])?.name ?? "")
        : `${filters.categories.length} categories`;

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
                active={filters.categories.length === 0}
                onPress={() => setFilters((prev) => ({ ...prev, categories: [] }))}
                style={styles.railItem}
              />
            }
            renderItem={({ item }) => (
              <Chip
                label={titleCase(item.name)}
                active={filters.categories.includes(item._id)}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    categories: toggle(prev.categories, item._id),
                  }))
                }
                style={styles.railItem}
              />
            )}
          />
        ) : null}

        {!searching ? (
          <View style={[styles.metaRow, styles.headerPad]}>
            <Text size={14} weight="600" numberOfLines={1} style={styles.metaText}>
              {metaLabel || "All products"}
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
        filters={filters}
        categories={categories}
        facets={facets}
        ceiling={ceiling}
        onClose={() => setSheetOpen(false)}
        onChange={setFilters}
        onClear={() => setFilters(DEFAULT_FILTERS)}
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
    maxHeight: "88%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
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
  sheetScroll: {
    flexShrink: 1,
  },
  sheetContent: {
    paddingBottom: 6,
  },
  sheetLabel: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 8,
  },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  slider: {
    height: 34,
    justifyContent: "center",
  },
  sliderRail: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.brand,
  },
  sliderThumb: {
    position: "absolute",
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: colors.brand,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  colorWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  colorItem: {
    alignItems: "center",
    gap: 6,
    width: 56,
  },
  colorRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  colorRingActive: {
    borderColor: colors.brand,
    borderWidth: 2,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sheetFooter: {
    marginTop: 12,
  },
});
