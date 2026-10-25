import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
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
import {
  isMapboxEnabled,
  newMapboxSession,
  retrieveAddress,
  suggestAddresses,
  type MapboxSuggestion,
} from "@/lib/mapbox";
import { IAddress } from "@/types/api";

const LABELS = ["Home", "Work", "Other"] as const;

type Label = (typeof LABELS)[number];

type FieldErrors = Partial<Record<"name" | "phone" | "addressLine1" | "city" | "state" | "zipCode", string>>;

const NAME_PATTERN = /^[\p{L}\p{M}'.\- ]+$/u;
const PHONE_PATTERN = /^\+?[\d\s\-().]+$/;
const PIN_PATTERN = /^\d{6}$/;

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
  const [errors, setErrors] = useState<FieldErrors>({});

  const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const sessionRef = useRef(newMapboxSession());

  const query = addressLine1.trim();
  const searchActive = isMapboxEnabled && searchEnabled && query.length >= 3;

  useEffect(() => {
    if (!searchActive) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setSearching(true);

      try {
        const results = await suggestAddresses(query, sessionRef.current, controller.signal);
        if (!controller.signal.aborted) setSuggestions(results);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchActive]);

  const pickSuggestion = async (suggestion: MapboxSuggestion) => {
    setSearchEnabled(false);
    setSuggestions([]);
    setSearching(false);

    try {
      const resolved = await retrieveAddress(suggestion.mapboxId, sessionRef.current);

      setAddressLine1(resolved.addressLine1 || suggestion.primaryText);
      if (resolved.city) setCity(resolved.city);
      if (resolved.state) setState(resolved.state);
      if (resolved.zipCode) setZipCode(resolved.zipCode);
      if (resolved.country) setCountry(resolved.country);
      setErrors({});
    } catch {
      setAddressLine1(suggestion.primaryText);
    } finally {
      sessionRef.current = newMapboxSession();
    }
  };

  const validate = () => {
    const next: FieldErrors = {};

    if (!name.trim()) next.name = "Full name is required";
    else if (!NAME_PATTERN.test(name.trim())) next.name = "Use letters only";

    if (!phone.trim()) next.phone = "Phone number is required";
    else if (!PHONE_PATTERN.test(phone.trim())) next.phone = "Digits only, e.g. +91 98450 12345";

    if (!addressLine1.trim()) next.addressLine1 = "Address line 1 is required";
    if (!city.trim()) next.city = "City is required";
    if (!state.trim()) next.state = "State is required";

    if (!zipCode.trim()) next.zipCode = "PIN code is required";
    else if (!PIN_PATTERN.test(zipCode.trim())) next.zipCode = "Enter a 6-digit PIN code";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Toast.show({ type: "error", text1: "Please fix the highlighted fields" });
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
      country: country.trim() || "India",
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
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
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
            onChangeText={(value) => {
              setName(value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            autoComplete="name"
            autoCapitalize="words"
          />
          <Input
            label="Phone"
            placeholder="98450 12345"
            value={phone}
            onChangeText={(value) => {
              setPhone(value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            error={errors.phone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          <Input
            label="Address line 1"
            placeholder="Flat / house no, building"
            value={addressLine1}
            onChangeText={(value) => {
              setAddressLine1(value);
              setSearchEnabled(true);
              if (errors.addressLine1) setErrors((prev) => ({ ...prev, addressLine1: undefined }));
            }}
            error={errors.addressLine1}
          />

          {searchActive && (searching || suggestions.length > 0) ? (
            <View style={styles.suggestions}>
              {searching && suggestions.length === 0 ? (
                <View style={styles.suggestionStatus}>
                  <ActivityIndicator color={colors.brand} size="small" />
                  <Text size={12} color="muted">
                    Searching addresses…
                  </Text>
                </View>
              ) : null}

              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.mapboxId}
                  onPress={() => pickSuggestion(suggestion)}
                  activeOpacity={0.7}
                  style={styles.suggestion}
                  accessibilityRole="button"
                >
                  <MapPinIcon color={colors.brand} size={16} />
                  <View style={styles.suggestionText}>
                    <Text size={14} weight="600" numberOfLines={1}>
                      {suggestion.primaryText}
                    </Text>
                    {suggestion.secondaryText ? (
                      <Text size={12} color="muted" numberOfLines={2}>
                        {suggestion.secondaryText}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <Input
            label="Address line 2 (optional)"
            placeholder="Street, area"
            value={addressLine2}
            onChangeText={setAddressLine2}
          />

          <View style={styles.pair}>
            <View style={styles.pairItem}>
              <Input
                label="City"
                placeholder="Mangaluru"
                value={city}
                onChangeText={(value) => {
                  setCity(value);
                  if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                }}
                error={errors.city}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.pairItem}>
              <Input
                label="State"
                placeholder="Karnataka"
                value={state}
                onChangeText={(value) => {
                  setState(value);
                  if (errors.state) setErrors((prev) => ({ ...prev, state: undefined }));
                }}
                error={errors.state}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.pair}>
            <View style={styles.pairItem}>
              <Input
                label="PIN code"
                placeholder="575002"
                value={zipCode}
                onChangeText={(value) => {
                  setZipCode(value);
                  if (errors.zipCode) setErrors((prev) => ({ ...prev, zipCode: undefined }));
                }}
                error={errors.zipCode}
                keyboardType="number-pad"
                maxLength={6}
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
  suggestions: {
    marginTop: -8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  suggestionStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  suggestionText: {
    flex: 1,
    gap: 2,
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
