import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";

import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Text from "@/components/ui/Text";
import Badge, { BadgeTone } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { PackageIcon } from "@/assets/icons/PackageIcon";
import { colors, radius } from "@/constant/color";
import { formatAddressLines, formatDate, formatPrice } from "@/lib/format";
import { useOrderByIdQuery } from "@/hooks/useOrders";
import { IProduct } from "@/types/api";

const STATUS_TONE: Record<string, BadgeTone> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  processing: "info",
  shipped: "info",
  delivered: "success",
};

const TIMELINE = ["processing", "shipped", "delivered"] as const;

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useOrderByIdQuery(id || "");

  const order = data?.data;

  if (isLoading) {
    return (
      <>
        <Header title="Order details" />
        <Container bottomInset extraStyle={styles.noPad}>
          <View style={styles.listPad}>
            <ListSkeleton count={3} height={120} />
          </View>
        </Container>
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <Header title="Order details" />
        <Container bottomInset extraStyle={styles.noPad}>
          <EmptyState
            title="Order unavailable"
            body="We could not load this order. It may have been removed."
            icon={<PackageIcon color={colors.muted} size={24} />}
            actionLabel="Try again"
            onAction={() => refetch()}
          />
        </Container>
      </>
    );
  }

  const currentStep = TIMELINE.indexOf(order.orderStatus as (typeof TIMELINE)[number]);
  const addressLines = order.address ? formatAddressLines(order.address) : [];
  // Card orders are only settled by the Stripe webhook.
  const awaitingPayment = order.paymentType === "card" && order.paymentStatus === "pending";

  return (
    <>
      <Header title="Order details" />
      <Container bottomInset extraStyle={styles.noPad}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.headRow}>
              <View>
                <Text size={11} weight="700" color="muted" style={styles.label}>
                  Order
                </Text>
                <Text size={17} weight="600" style={styles.orderNo}>
                  #{order._id.slice(-8).toUpperCase()}
                </Text>
              </View>
              <Text size={13} color="muted">
                {formatDate(order.createdAt)}
              </Text>
            </View>

            <View style={styles.badges}>
              <Badge
                label={order.orderStatus}
                tone={STATUS_TONE[order.orderStatus] ?? "neutral"}
                variant="soft"
              />
              <Badge
                label={awaitingPayment ? "Awaiting payment" : order.paymentStatus}
                tone={STATUS_TONE[order.paymentStatus] ?? "neutral"}
                variant="soft"
              />
              <Badge label={order.paymentType} tone="neutral" variant="soft" />
            </View>
          </View>

          <View style={styles.card}>
            <Text size={11} weight="700" color="muted" style={styles.label}>
              Progress
            </Text>

            <View style={styles.timeline}>
              {TIMELINE.map((step, index) => {
                const done = index <= currentStep;
                const isLast = index === TIMELINE.length - 1;

                return (
                  <View key={step} style={styles.timelineRow}>
                    <View style={styles.timelineRail}>
                      <View style={[styles.dot, done && styles.dotDone]} />
                      {!isLast ? (
                        <View style={[styles.line, index < currentStep && styles.lineDone]} />
                      ) : null}
                    </View>

                    <Text
                      size={14}
                      weight={done ? "600" : "400"}
                      color={done ? "foreground" : "subtle"}
                      style={styles.timelineLabel}
                    >
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text size={11} weight="700" color="muted" style={styles.label}>
              Items
            </Text>

            {order.products.map((line, index) => {
              const product =
                typeof line.product === "object" ? (line.product as IProduct) : null;

              return (
                <View
                  key={index}
                  style={[styles.itemRow, index > 0 && styles.itemRowDivided]}
                >
                  <View style={styles.thumb}>
                    {product ? (
                      <Image
                        source={product.image}
                        style={StyleSheet.absoluteFill}
                        contentFit="contain"
                      />
                    ) : (
                      <PackageIcon color={colors.borderStrong} size={18} />
                    )}
                  </View>

                  <View style={styles.itemText}>
                    <Text size={14} weight="500" numberOfLines={2}>
                      {product?.name ?? `Product ${index + 1}`}
                    </Text>
                    <Text size={12} color="muted">
                      Qty {line.quantity}
                    </Text>
                  </View>

                  <Text size={14} weight="600">
                    {formatPrice(line.price * line.quantity)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.card}>
            <Text size={11} weight="700" color="muted" style={styles.label}>
              Delivery
            </Text>

            {order.address?.name ? (
              <Text size={14} weight="600">
                {order.address.name}
              </Text>
            ) : null}

            {addressLines.map((line) => (
              <Text key={line} size={13} color="muted" style={styles.addressLine}>
                {line}
              </Text>
            ))}

            {order.address?.phone ? (
              <Text size={13} color="muted" style={styles.addressLine}>
                {order.address.phone}
              </Text>
            ) : null}
          </View>

          <View style={styles.card}>
            <Text size={11} weight="700" color="muted" style={styles.label}>
              Payment summary
            </Text>

            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row
              label="Delivery"
              value={order.deliveryCharge ? formatPrice(order.deliveryCharge) : "Free"}
              tone={order.deliveryCharge ? undefined : colors.success}
            />

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text size={15} weight="600">
                Total
              </Text>
              <Text size={22} weight="700" variant="display" style={styles.totalValue}>
                {formatPrice(order.totalAmount)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </Container>
    </>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <View style={styles.row}>
      <Text size={14} color="muted">
        {label}
      </Text>
      <Text size={14} style={tone ? { color: tone } : undefined}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  listPad: {
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 10,
  },
  label: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  orderNo: {
    letterSpacing: 0.6,
    marginTop: 2,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  timeline: {
    marginTop: 4,
    gap: 0,
  },
  timelineRow: {
    flexDirection: "row",
    gap: 12,
  },
  timelineRail: {
    alignItems: "center",
    width: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    marginTop: 3,
  },
  dotDone: {
    backgroundColor: colors.brand,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: colors.border,
    marginVertical: 3,
  },
  lineDone: {
    backgroundColor: colors.brand,
  },
  timelineLabel: {
    paddingBottom: 18,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemRowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    flex: 1,
    gap: 2,
  },

  addressLine: {
    lineHeight: 19,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalValue: {
    letterSpacing: 0.3,
  },
});
