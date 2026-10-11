import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { colors } from "@/constant/color";
import { useMyOrdersQuery } from "@/hooks/useOrders";
import { useRouter } from "expo-router";
import { IOrder } from "@/types/api";
import { PackageIcon } from "@/assets/icons/PackageIcon";

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  paid: "#10b981",
  failed: "#ef4444",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
};

export default function MyOrders() {
  const router = useRouter();

  const { data, isLoading, isError, refetch, isRefetching } = useMyOrdersQuery(1);

  const orders: IOrder[] = data?.data || [];

  const renderOrder = ({ item }: { item: IOrder }) => {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return (
      <TouchableOpacity
        style={[styles.orderCard, { backgroundColor: colors.surface }]}
        onPress={() => router.push(`/profile/order-detail/${item._id}`)}
      >
        <View style={styles.orderHeader}>
          <Text size={14} weight="600">
            #{item._id.slice(-8).toUpperCase()}
          </Text>
          <Text size={14} color="muted">
            {date}
          </Text>
        </View>

        <View style={styles.orderBody}>
          <Text size={14} color="muted">
            {item.products.length} item{item.products.length !== 1 ? "s" : ""}
          </Text>
          <Text size={16} weight="600">
            ${item.totalAmount?.toFixed(2)}
          </Text>
        </View>

        <View style={styles.badges}>
          <View
            style={[
              styles.badge,
              { backgroundColor: (statusColors[item.paymentStatus] || "#6b7280") + "20" },
            ]}
          >
            <Text
              size={14}
              weight="500"
              style={{ color: statusColors[item.paymentStatus] || "#6b7280" }}
            >
              {item.paymentStatus?.toUpperCase()}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: (statusColors[item.orderStatus] || "#6b7280") + "20" },
            ]}
          >
            <Text
              size={14}
              weight="500"
              style={{ color: statusColors[item.orderStatus] || "#6b7280" }}
            >
              {item.orderStatus?.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Container bottomInset extraStyle={{ justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.brand} />
        </Container>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <Container
          bottomInset
          extraStyle={{ justifyContent: "center", alignItems: "center", gap: 20 }}
        >
          <Text align="center">Failed to load orders</Text>
          <Button text="Retry" onPress={() => refetch()} />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container bottomInset extraStyle={{ paddingTop: 10 }}>
        {orders.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
            <PackageIcon color={colors.muted} size={48} />
            <Text align="center" color="muted" size={18}>
              No orders yet
            </Text>
            <Button text="Start Shopping" onPress={() => router.push("/shop")} />
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderOrder}
            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor={colors.brand}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
