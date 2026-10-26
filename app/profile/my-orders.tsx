import React from "react";
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import Container from "@/layout/container";
import Header from "@/layout/header";
import Text from "@/components/ui/text";
import Badge, { BadgeTone } from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/skeleton";
import { PackageIcon } from "@/assets/icons/package-icon";
import { ChevronRightIcon } from "@/assets/icons/chevron-right-icon";
import { colors, radius } from "@/constant/color";
import { formatDate, formatPrice } from "@/lib/format";
import { useMyOrdersQuery } from "@/hooks/useOrders";
import { IOrder, IProduct } from "@/types/api";

const STATUS_TONE: Record<string, BadgeTone> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  processing: "info",
  shipped: "info",
  delivered: "success",
};

export default function MyOrders() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useMyOrdersQuery(1);

  const orders: IOrder[] = data?.data || [];

  if (isLoading) {
    return (
      <>
        <Header title="My orders" />
        <Container bottomInset extraStyle={styles.noPad}>
          <View style={styles.listPad}>
            <ListSkeleton count={3} height={132} />
          </View>
        </Container>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header title="My orders" />
        <Container bottomInset extraStyle={styles.noPad}>
          <EmptyState
            title="Could not load orders"
            body="We could not reach your order history. Try again in a moment."
            icon={<PackageIcon color={colors.muted} size={24} />}
            actionLabel="Try again"
            onAction={() => refetch()}
          />
        </Container>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Header title="My orders" />
        <Container bottomInset extraStyle={styles.noPad}>
          <EmptyState
            title="No orders yet"
            body="When you place an order, it will appear here with live status."
            icon={<PackageIcon color={colors.muted} size={24} />}
            actionLabel="Start shopping"
            onAction={() => router.push("/(tabs)/shop")}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header title="My orders" />
      <Container bottomInset extraStyle={styles.noPad}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.brand}
            />
          }
          renderItem={({ item }) => {
            const thumbs = item.products
              .map((line) => (typeof line.product === "object" ? (line.product as IProduct) : null))
              .filter((p): p is IProduct => Boolean(p))
              .slice(0, 3);

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push(`/profile/order-detail/${item._id}`)}
                accessibilityRole="button"
                accessibilityLabel={`Order ${item._id.slice(-8)}`}
              >
                <View style={styles.cardHead}>
                  <View style={styles.headText}>
                    <Text size={13} weight="600" style={styles.orderNo}>
                      #{item._id.slice(-8).toUpperCase()}
                    </Text>
                    <Text size={12} color="muted">
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>

                  <ChevronRightIcon color={colors.subtle} size={18} />
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.thumbs}>
                    {thumbs.map((product, index) => (
                      <View key={product._id} style={[styles.thumb, index > 0 && styles.thumbOverlap]}>
                        <Image
                          source={product.image}
                          style={StyleSheet.absoluteFill}
                          contentFit="contain"
                        />
                      </View>
                    ))}

                    {thumbs.length === 0 ? (
                      <View style={styles.thumb}>
                        <PackageIcon color={colors.borderStrong} size={18} />
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.amounts}>
                    <Text size={12} color="muted">
                      {item.products.length} item{item.products.length === 1 ? "" : "s"}
                    </Text>
                    <Text size={18} weight="700" variant="display" style={styles.amount}>
                      {formatPrice(item.totalAmount)}
                    </Text>
                  </View>
                </View>

                <View style={styles.badges}>
                  <Badge label={item.orderStatus} tone={STATUS_TONE[item.orderStatus] ?? "neutral"} variant="soft" />
                  <Badge label={item.paymentStatus} tone={STATUS_TONE[item.paymentStatus] ?? "neutral"} variant="soft" />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  listPad: {
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 12,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headText: {
    gap: 1,
  },
  orderNo: {
    letterSpacing: 0.6,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  thumbs: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbOverlap: {
    marginLeft: -12,
  },
  amounts: {
    alignItems: "flex-end",
    gap: 1,
  },
  amount: {
    letterSpacing: 0.3,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
  },
});
