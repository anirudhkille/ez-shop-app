import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import React from "react";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { colors } from "@/constant/color";
import { useOrderByIdQuery } from "@/hooks/useOrders";
import { useLocalSearchParams } from "expo-router";

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  paid: "#10b981",
  failed: "#ef4444",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
};

const timelineSteps = ["processing", "shipped", "delivered"];

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useOrderByIdQuery(id || "");

  const order = data?.data;

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

  if (isError || !order) {
    return (
      <>
        <Header />
        <Container
          bottomInset
          extraStyle={{ justifyContent: "center", alignItems: "center", gap: 20 }}
        >
          <Text align="center">Failed to load order details</Text>
          <Button text="Retry" onPress={() => refetch()} />
        </Container>
      </>
    );
  }

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentStepIndex = timelineSteps.indexOf(order.orderStatus);

  return (
    <>
      <Header />
      <Container bottomInset extraStyle={{ paddingTop: 10 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20, paddingBottom: 40 }}
        >
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.row}>
              <Text size={14} color="muted">
                Order ID
              </Text>
              <Text weight="600">#{order._id.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={styles.row}>
              <Text size={14} color="muted">
                Date
              </Text>
              <Text>{date}</Text>
            </View>
            <View style={styles.row}>
              <Text size={14} color="muted">
                Payment
              </Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: statusColors[order.paymentStatus] || "#6b7280" },
                  ]}
                />
                <Text>{order.paymentStatus?.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text size={14} color="muted">
                Payment Type
              </Text>
              <Text>{order.paymentType?.toUpperCase()}</Text>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text weight="600" size={18}>
              Delivery Address
            </Text>
            <Text style={{ marginTop: 8 }}>{order.address?.name}</Text>
            <Text color="muted">{order.address?.addressLine1}</Text>
            {order.address?.addressLine2 ? (
              <Text color="muted">{order.address?.addressLine2}</Text>
            ) : null}
            <Text color="muted">
              {order.address?.city}, {order.address?.state} {order.address?.zipCode}
            </Text>
            <Text color="muted">{order.address?.country}</Text>
            <Text color="muted">{order.address?.phone}</Text>
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text weight="600" size={18}>
              Order Items
            </Text>
            {order.products?.map((item: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.productRow,
                  index < order.products.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    paddingBottom: 12,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text weight="500">
                    {typeof item.product === "object" ? item.product.name : `Product #${index + 1}`}
                  </Text>
                  <Text size={14} color="muted">
                    Qty: {item.quantity}
                  </Text>
                </View>
                <Text weight="600">${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.row}>
              <Text color="muted">Subtotal</Text>
              <Text>${order.subtotal?.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text color="muted">Delivery</Text>
              <Text>${order.deliveryCharge?.toFixed(2)}</Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                  paddingTop: 12,
                  marginTop: 4,
                },
              ]}
            >
              <Text weight="600" size={18}>
                Total
              </Text>
              <Text weight="600" size={18}>
                ${order.totalAmount?.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text weight="600" size={18}>
              Order Timeline
            </Text>
            <View style={{ marginTop: 16 }}>
              {timelineSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <View key={step} style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                      <View
                        style={[
                          styles.timelineDot,
                          {
                            backgroundColor: isCompleted ? statusColors[step] : colors.border,
                            borderColor: isCurrent ? statusColors[step] : "transparent",
                          },
                        ]}
                      />
                      {index < timelineSteps.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            {
                              backgroundColor: isCompleted ? statusColors[step] : colors.border,
                            },
                          ]}
                        />
                      )}
                    </View>
                    <View
                      style={{
                        marginLeft: 12,
                        paddingBottom: index < timelineSteps.length - 1 ? 24 : 0,
                      }}
                    >
                      <Text
                        weight={isCompleted ? "600" : "400"}
                        color={isCompleted ? "brand" : "subtle"}
                        style={{ textTransform: "capitalize" }}
                      >
                        {step}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    gap: 12,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineLeft: {
    alignItems: "center",
    width: 20,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
});
