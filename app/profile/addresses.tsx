import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { colors } from "@/constant/color";
import { useAddressesQuery, useDeleteAddressMutation } from "@/hooks/useAddress";
import { useRouter } from "expo-router";
import { IAddress } from "@/types/api";
import { UserIcon } from "@/assets/icons/UserIcon";
import Toast from "react-native-toast-message";

export default function Addresses() {
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useAddressesQuery();
  const { mutate: deleteAddress } = useDeleteAddressMutation();

  const addresses: IAddress[] = data?.data || [];

  const handleDelete = (id: string) => {
    Alert.alert("Delete Address", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteAddress(id, {
            onSuccess: () => Toast.show({ type: "success", text1: "Address deleted" }),
            onError: (err: any) =>
              Toast.show({ type: "error", text1: err?.message || "Delete failed" }),
          }),
      },
    ]);
  };

  const renderAddress = ({ item }: { item: IAddress }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text weight="600">{item.label}</Text>
          {item.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: colors.brand }]}>
              <Text size={14} weight="500" style={{ color: colors.background }}>
                Default
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text style={{ marginTop: 4 }}>{item.name}</Text>
      <Text color="muted">{item.addressLine1}</Text>
      {item.addressLine2 ? <Text color="muted">{item.addressLine2}</Text> : null}
      <Text color="muted">
        {item.city}, {item.state} {item.zipCode}
      </Text>
      <Text color="muted">{item.country}</Text>
      <Text color="muted">{item.phone}</Text>

      <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: colors.border }]}
          onPress={() => router.push(`/profile/add-address?id=${item._id}`)}
        >
          <Text size={14} color="foreground">
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: "#ef4444" }]}
          onPress={() => handleDelete(item._id)}
        >
          <Text size={14} style={{ color: "#ef4444" }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <Text align="center">Failed to load addresses</Text>
          <Button text="Retry" onPress={() => refetch()} />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container bottomInset extraStyle={{ paddingTop: 10 }}>
        {addresses.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
            <UserIcon color={colors.muted} size={48} />
            <Text align="center" color="muted" size={18}>
              No addresses saved
            </Text>
            <Button text="Add Address" onPress={() => router.push("/profile/add-address")} />
          </View>
        ) : (
          <>
            <FlatList
              data={addresses}
              keyExtractor={(item) => item._id}
              renderItem={renderAddress}
              contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
            <View style={{ paddingVertical: 16 }}>
              <Button text="Add Address" onPress={() => router.push("/profile/add-address")} />
            </View>
          </>
        )}
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
});
