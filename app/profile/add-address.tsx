import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Container from "@/layout/Container";
import Header from "@/layout/Header";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import {
  useCreateAddressMutation,
  useAddressesQuery,
} from "@/hooks/useAddress";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const LABELS = ["Home", "Work", "Other"] as const;

export default function AddAddress() {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: addressesRes } = useAddressesQuery();
  const { mutate: createAddress, isPending } = useCreateAddressMutation();

  const [label, setLabel] = useState<"Home" | "Work" | "Other">("Home");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (id && addressesRes?.data) {
      const existing = addressesRes.data.find((a: any) => a._id === id);
      if (existing) {
        setLabel(existing.label);
        setName(existing.name);
        setPhone(existing.phone);
        setAddressLine1(existing.addressLine1);
        setAddressLine2(existing.addressLine2 || "");
        setCity(existing.city);
        setState(existing.state);
        setZipCode(existing.zipCode);
        setCountry(existing.country);
        setIsDefault(existing.isDefault);
      }
    }
  }, [id, addressesRes]);

  const handleSave = () => {
    if (!name || !addressLine1 || !city || !state || !zipCode || !country || !phone) {
      Toast.show({ type: "error", text1: "Please fill all required fields" });
      return;
    }

    createAddress(
      { label, name, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: id ? "Address updated" : "Address added",
          });
          router.back();
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: err?.message || "Failed to save address",
          });
        },
      }
    );
  };

  return (
    <>
      <Header title={id ? "Edit Address" : "Add Address"} />
      <Container extraStyle={{ paddingTop: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingBottom: 40 }}>
          <View>
            <Text style={{ marginBottom: 8 }}>Label</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {LABELS.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[
                    styles.labelBtn,
                    {
                      borderColor: label === l ? themeColors.primary : themeColors.border,
                      backgroundColor: label === l ? themeColors.primary + "15" : themeColors.card,
                    },
                  ]}
                  onPress={() => setLabel(l)}
                >
                  <Text
                    weight={label === l ? "600" : "400"}
                    color={label === l ? "primary" : "accent"}
                  >
                    {l}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input label="Full Name" value={name} onChangeText={setName} />
          <Input label="Phone" value={phone} onChangeText={setPhone} />
          <Input label="Address Line 1" value={addressLine1} onChangeText={setAddressLine1} />
          <Input label="Address Line 2 (Optional)" value={addressLine2} onChangeText={setAddressLine2} />
          <Input label="City" value={city} onChangeText={setCity} />
          <Input label="State" value={state} onChangeText={setState} />
          <Input label="Zip Code" value={zipCode} onChangeText={setZipCode} />
          <Input label="Country" value={country} onChangeText={setCountry} />

          <TouchableOpacity
            style={[styles.checkboxRow]}
            onPress={() => setIsDefault(!isDefault)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: themeColors.primary,
                  backgroundColor: isDefault ? themeColors.primary : "transparent",
                },
              ]}
            >
              {isDefault && <Text size={14} style={{ color: "#fff" }}>✓</Text>}
            </View>
            <Text>Set as default address</Text>
          </TouchableOpacity>

          <Button text={id ? "Update Address" : "Save Address"} onPress={handleSave} loading={isPending} />
        </ScrollView>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  labelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
