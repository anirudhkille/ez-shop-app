import React from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Container from "@/layout/container";
import Header from "@/layout/header";
import Text from "@/components/ui/text";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import EmptyState from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/skeleton";
import { MapPinIcon } from "@/assets/icons/map-pin-icon";
import { colors, radius } from "@/constant/color";
import { formatAddressLines } from "@/lib/format";
import { useAddressesQuery, useDeleteAddressMutation } from "@/hooks/useAddress";
import { IAddress } from "@/types/api";

export default function Addresses() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useAddressesQuery();
  const { mutate: deleteAddress } = useDeleteAddressMutation();

  const addresses: IAddress[] = data?.data || [];

  const handleDelete = (id: string) => {
    Alert.alert("Delete address", "This address will be removed from your account.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteAddress(id, {
            onSuccess: () => Toast.show({ type: "success", text1: "Address deleted" }),
            onError: (err: any) =>
              Toast.show({ type: "error", text1: err?.message || "Could not delete address" }),
          }),
      },
    ]);
  };

  const renderAddress = ({ item }: { item: IAddress }) => {
    const lines = formatAddressLines(item);

    return (
      <View style={styles.card}>
        <View style={styles.cardHead}>
          <View style={styles.labelRow}>
            <Text size={14} weight="600" style={styles.label}>
              {item.label}
            </Text>
            {item.isDefault ? <Badge label="Default" tone="brand" variant="soft" /> : null}
          </View>
        </View>

        <Text size={14} weight="500">
          {item.name}
        </Text>

        <View style={styles.lines}>
          {lines.map((line) => (
            <Text key={line} size={13} color="muted" style={styles.line}>
              {line}
            </Text>
          ))}
          {item.phone ? (
            <Text size={13} color="muted" style={styles.line}>
              {item.phone}
            </Text>
          ) : null}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.border }]}
            onPress={() => router.push(`/profile/add-address?id=${item._id}`)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${item.label} address`}
          >
            <Text size={13} weight="600">
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: "rgba(229,72,77,0.5)" }]}
            onPress={() => handleDelete(item._id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${item.label} address`}
          >
            <Text size={13} weight="600" color="destructive">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <>
        <Header title="Saved addresses" />
        <Container bottomInset extraStyle={styles.noPad}>
          <View style={styles.listPad}>
            <ListSkeleton count={2} height={168} />
          </View>
        </Container>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header title="Saved addresses" />
        <Container bottomInset extraStyle={styles.noPad}>
          <EmptyState
            title="Could not load addresses"
            body="Check your connection and try again."
            icon={<MapPinIcon color={colors.muted} size={24} />}
            actionLabel="Try again"
            onAction={() => refetch()}
          />
        </Container>
      </>
    );
  }

  if (addresses.length === 0) {
    return (
      <>
        <Header title="Saved addresses" />
        <Container bottomInset extraStyle={styles.noPad}>
          <EmptyState
            title="No addresses yet"
            body="Save an address so checkout takes one tap next time."
            icon={<MapPinIcon color={colors.muted} size={24} />}
            actionLabel="Add address"
            onAction={() => router.push("/profile/add-address")}
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header title="Saved addresses" />
      <Container bottomInset extraStyle={styles.noPad}>
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          renderItem={renderAddress}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />

        <View style={styles.footer}>
          <Button text="Add address" onPress={() => router.push("/profile/add-address")} />
        </View>
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
    paddingBottom: 8,
    gap: 12,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    gap: 4,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  lines: {
    gap: 1,
    marginTop: 2,
  },
  line: {
    lineHeight: 19,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
