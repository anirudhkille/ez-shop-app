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
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import { useAddressesQuery, useDeleteAddressMutation } from "@/hooks/useAddress";
import { useRouter } from "expo-router";
import { IAddress } from "@/types/api";
import { UserIcon } from "@/assets/icons/UserIcon";
import Toast from "react-native-toast-message";

export default function Addresses() {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];
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
    <View style={[styles.card, { backgroundColor: themeColors.card }]}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text weight="600">{item.label}</Text>
          {item.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: themeColors.primary }]}>
              <Text size={14} weight="500" style={{ color: themeColors.background }}>
                Default
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text style={{ marginTop: 4 }}>{item.name}</Text>
      <Text color="accent">{item.addressLine1}</Text>
      {item.addressLine2 ? <Text color="accent">{item.addressLine2}</Text> : null}
      <Text color="accent">
        {item.city}, {item.state} {item.zipCode}
      </Text>
      <Text color="accent">{item.country}</Text>
      <Text color="accent">{item.phone}</Text>

      <View style={[styles.cardActions, { borderTopColor: themeColors.border }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: themeColors.border }]}
          onPress={() => router.push(`/profile/add-address?id=${item._id}`)}
        >
          <Text size={14} color="primary">
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
        <Header title="Addresses" />
        <Container extraStyle={{ justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={themeColors.primary} />
        </Container>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header title="Addresses" />
        <Container extraStyle={{ justifyContent: "center", alignItems: "center", gap: 20 }}>
          <Text align="center">Failed to load addresses</Text>
          <Button text="Retry" onPress={() => refetch()} />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header title="Addresses" />
      <Container extraStyle={{ paddingTop: 10 }}>
        {addresses.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
            <UserIcon color={themeColors.accent} size={48} />
            <Text align="center" color="accent" size={18}>
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
