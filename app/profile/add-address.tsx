import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon";
import { MapPinIcon } from "@/assets/icons/MapPinIcon";
import { colors, radius } from "@/constant/color";
import {
  useAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from "@/hooks/useAddress";
import { IAddress } from "@/types/api";

const LABELS = ["Home", "Work", "Other"] as const;

type Label = (typeof LABELS)[number];

/**
 * The form holds the draft, so it is mounted only once the address it edits is
 * known. Seeding the fields from an effect meant an empty form flashed first
 * and any early typing was overwritten when the record arrived.
 */
function AddressForm({ address }: { address?: IAddress }) {
  const router = useRouter();
  const createAddress = useCreateAddressMutation();
  const updateAddress = useUpdateAddressMutation();

  const editing = Boolean(address);
  const busy = createAddress.isPending || updateAddress.isPending;

  const [label, setLabel] = useState<Label>((address?.label as Label) ?? "Home");
  const [name, setName] = useState(address?.name ?? "");
  const [phone, setPhone] = useState(address?.phone ?? "");
  const [addressLine1, setAddressLine1] = useState(address?.addressLine1 ?? "");
  const [addressLine2, setAddressLine2] = useState(address?.addressLine2 ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [state, setState] = useState(address?.state ?? "");
  const [zipCode, setZipCode] = useState(address?.zipCode ?? "");
  const [country, setCountry] = useState(address?.country ?? "India");
  const [isDefault, setIsDefault] = useState(Boolean(address?.isDefault));

  const handleSave = () => {
    const required: [string, string][] = [
      [name, "Full name"],
      [phone, "Phone"],
      [addressLine1, "Address line 1"],
      [city, "City"],
      [state, "State"],
      [zipCode, "Zip code"],
      [country, "Country"],
    ];
    const missing = required.find(([value]) => !value.trim());
    if (missing) {
      Toast.show({ type: "error", text1: `Please enter your ${missing[1].toLowerCase()}` });
      return;
    }

    const payload: Partial<IAddress> = {
      label,
      name: name.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country.trim(),
      isDefault,
    };

    const onSuccess = () => {
      Toast.show({ type: "success", text1: editing ? "Address updated" : "Address added" });
      router.back();
    };
    const onError = (err: any) =>
      Toast.show({ type: "error", text1: err?.message || "Could not save the address" });

    // Editing used to run the create mutation, which quietly added a second
    // copy of the address instead of changing the one that was opened.
    if (address) {
      updateAddress.mutate({ id: address._id, data: payload }, { onSuccess, onError });
    } else {
      createAddress.mutate(payload, { onSuccess, onError });
    }
  };

  return (
    <>
      <Header title={editing ? "Edit address" : "Add address"} />

      <Container bottomInset extraStyle={styles.noPad}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.field}>
            <Text size={11} weight="700" color="muted" style={styles.fieldLabel}>
              Label
            </Text>

            <View style={styles.labelRow}>
              {LABELS.map((option) => {
                const active = label === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setLabel(option)}
                    activeOpacity={0.8}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    style={[styles.labelChip, active && styles.labelChipActive]}
                  >
                    <Text size={13} weight="600" color={active ? "brand" : "muted"}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Input
            label="Full name"
            placeholder="Anirudh Kille"
            value={name}
            onChangeText={setName}
            autoComplete="name"
          />
          <Input
            label="Phone"
            placeholder="98450 12345"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <Input
            label="Address line 1"
            placeholder="Flat / house no, building"
            value={addressLine1}
            onChangeText={setAddressLine1}
          />
          <Input
            label="Address line 2 (optional)"
            placeholder="Street, area"
            value={addressLine2}
            onChangeText={setAddressLine2}
          />

          <View style={styles.pair}>
            <View style={styles.pairItem}>
              <Input label="City" placeholder="Mangaluru" value={city} onChangeText={setCity} />
            </View>
            <View style={styles.pairItem}>
              <Input label="State" placeholder="Karnataka" value={state} onChangeText={setState} />
            </View>
          </View>

          <View style={styles.pair}>
            <View style={styles.pairItem}>
              <Input
                label="Zip code"
                placeholder="575002"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.pairItem}>
              <Input label="Country" placeholder="India" value={country} onChangeText={setCountry} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.defaultRow}
            onPress={() => setIsDefault((value) => !value)}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isDefault }}
          >
            <CircleCheckIcon color={isDefault ? colors.brand : colors.subtle} size={22} />
            <View style={styles.defaultText}>
              <Text size={14} weight="500">
                Use as default address
              </Text>
              <Text size={12} color="muted">
                Pre-selected at checkout
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            text={editing ? "Save changes" : "Save address"}
            size="lg"
            onPress={handleSave}
            loading={busy}
          />
        </View>
      </Container>
    </>
  );
}

export default function AddAddress() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: addressesRes, isLoading } = useAddressesQuery();
  const existing = id ? addressesRes?.data?.find((item: IAddress) => item._id === id) : undefined;

  if (id && !existing) {
    return (
      <>
        <Header title="Edit address" />
        <Container bottomInset>
          {isLoading ? (
            <ListSkeleton count={3} height={64} />
          ) : (
            <EmptyState
              title="Address not found"
              body="It may have been removed. Go back and pick another address."
              icon={<MapPinIcon color={colors.muted} size={24} />}
              actionLabel="Go back"
              onAction={() => router.back()}
            />
          )}
        </Container>
      </>
    );
  }

  return <AddressForm key={existing?._id ?? "new"} address={existing} />;
}

const styles = StyleSheet.create({
  noPad: {
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 18,
  },
  field: {
    gap: 10,
  },
  fieldLabel: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  labelRow: {
    flexDirection: "row",
    gap: 8,
  },
  labelChip: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  labelChipActive: {
    borderColor: colors.brand,
    backgroundColor: "rgba(255,100,10,0.1)",
  },
  pair: {
    flexDirection: "row",
    gap: 12,
  },
  pairItem: {
    flex: 1,
  },
  defaultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  defaultText: {
    flex: 1,
    gap: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});
