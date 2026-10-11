import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useSearchProductsQuery } from "@/hooks/useProducts";
import { SearchIcon } from "@/assets/icons/SearchIcon";
import { ChevronLeftIcon } from "@/assets/icons/ChevronLeftIcon";
import { Image } from "expo-image";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { data: productsRes, isLoading } = useSearchProductsQuery(query);
  const products = (productsRes as any)?.data || (Array.isArray(productsRes) ? productsRes : []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeftIcon color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <SearchIcon color="#8C8C8C" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Search products..."
            placeholderTextColor="#8C8C8C"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF5500" />
        </View>
      ) : (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={products}
          keyExtractor={(item: any) => item._id || item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/product/${item.slug || "item"}/${item._id || item.id}`)}
            >
              <Image source={{ uri: item.images?.[0] || item.image }} style={styles.image} />
              <Text style={styles.title} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.price}>${item.price}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            query.length > 0 ? (
              <Text style={styles.emptyText}>No products found for "{query}"</Text>
            ) : (
              <Text style={styles.emptyText}>Type to start searching products</Text>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 16 },
  backButton: { marginRight: 12 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  input: { flex: 1, color: "#F5F5F5", marginLeft: 8, fontSize: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { paddingHorizontal: 12, paddingBottom: 24 },
  card: {
    flex: 1,
    backgroundColor: "#141414",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#262626",
    margin: 6,
    padding: 12,
    maxWidth: "48%",
  },
  image: { width: "100%", height: 140, borderRadius: 8, marginBottom: 8 },
  title: { color: "#F5F5F5", fontSize: 14, fontWeight: "500", marginBottom: 4 },
  price: { color: "#FF5500", fontSize: 16, fontWeight: "bold" },
  emptyText: { color: "#8C8C8C", textAlign: "center", marginTop: 40, fontSize: 16 },
});
