import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

import { colors, radius } from "@/constant/color";
import Text from "@/components/ui/Text";
import Badge, { BadgeTone } from "@/components/ui/Badge";
import Stars from "@/components/ui/Stars";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { formatPrice, discountPercent } from "@/lib/format";
import { IProduct } from "@/types/api";

type Variant = "grid" | "rail";

interface ProductCardProps {
  product: IProduct;
  onPress: () => void;
  /** `grid` fills its column; `rail` is a fixed-width carousel item. */
  variant?: Variant;
  /** Fixed width for the rail variant. */
  width?: number;
  showCategory?: boolean;
  /** Optional control pinned to the top-right of the image (e.g. a save heart). */
  overlayAction?: React.ReactNode;
}

const TAG_TONE: Record<string, BadgeTone> = {
  New: "brand",
  "Best Seller": "brand",
  Hot: "danger",
  Sale: "success",
  Limited: "warning",
  Trending: "neutral",
};

/** Two lines of 15/19 body copy - keeps every grid row the same height. */
const NAME_HEIGHT = 38;

export default function ProductCard({
  product,
  onPress,
  variant = "grid",
  width = 168,
  showCategory = true,
  overlayAction,
}: ProductCardProps) {
  const saving = discountPercent(product.price, product.discountPrice);
  const price = saving ? product.discountPrice : product.price;
  const categoryName = typeof product.category === "string" ? "" : (product.category?.name ?? "");
  const tone = product.tag ? TAG_TONE[product.tag] : undefined;

  return (
    <View
      style={[
        styles.card,
        variant === "grid" ? styles.grid : undefined,
        variant === "rail" ? { width } : undefined,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          saving
            ? `${product.name}, ${product.price} rupees, reduced to ${product.discountPrice} rupees`
            : `${product.name}, ${product.price} rupees`
        }
      >
        <View style={[styles.imageWrap, variant === "rail" ? { height: width } : undefined]}>
          {tone ? <Badge label={product.tag as string} tone={tone} style={styles.tag} /> : null}

          <PackageIcon color={colors.borderStrong} size={34} />

          <Image
            source={product.image}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            accessibilityIgnoresInvertColors
          />
        </View>

        <View style={styles.body}>
          {showCategory && categoryName ? (
            <Text size={10} weight="600" color="muted" numberOfLines={1} style={styles.eyebrow}>
              {categoryName}
            </Text>
          ) : null}

          <Text size={15} weight="500" numberOfLines={2} style={styles.name}>
            {product.name}
          </Text>

          <View style={styles.priceRow}>
            <Text size={18} weight="700" variant="display" style={styles.price} numberOfLines={1}>
              {formatPrice(price)}
            </Text>
            {saving ? (
              <Text size={12} color="muted" style={styles.wasPrice} numberOfLines={1}>
                {formatPrice(product.price)}
              </Text>
            ) : null}
          </View>

          <View style={styles.footer}>
            <Stars rating={product.rating} size={11} />
            {saving ? (
              <Text size={11} weight="600" style={styles.saving}>
                {"\u2212"}
                {saving}%
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      {/* Kept outside the pressable: a nested button is invalid markup on web
          and swallows its own press events on native. */}
      {overlayAction ? <View style={styles.overlayAction}>{overlayAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  grid: {
    // Half the row, minus the gap, so a lone card in a two-column list does not
    // stretch to full width (wishlist had one item and spanned the screen).
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: "50%",
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tag: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 2,
  },
  overlayAction: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
  },
  body: {
    padding: 12,
    gap: 6,
  },
  eyebrow: {
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: 14,
  },
  name: {
    lineHeight: 19,
    minHeight: NAME_HEIGHT,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    letterSpacing: 0.3,
    flexShrink: 0,
  },
  wasPrice: {
    textDecorationLine: "line-through",
    flexShrink: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minHeight: 18,
  },
  saving: {
    color: colors.success,
    flexShrink: 0,
  },
});
