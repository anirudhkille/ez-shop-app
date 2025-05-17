import React, { useCallback, useRef, useState } from "react";
import EmptyPage from "@/components/shared/EmptyCart";
import { Heart } from "lucide-react-native";
import { Image } from "expo-image";
import Container from "@/layout/Container";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Text from "@/components/ui/Text";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";

const { width } = Dimensions.get("window");

interface WishlistItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
}

export default function wishlist() {
  const theme = useThemeStore((state) => state.theme);
  const themeColors = colors[theme];

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleItemPress = (item: WishlistItem) => {
    alert("hi")
    setSelectedItem(item);
    console.log(selectedItem)
    bottomSheetRef.current?.expand(); // Open the bottom sheet
  };

  const wishlistItems: WishlistItem[] = [
    {
      id: "1",
      title: "Nike Air Max 270",
      imageUrl:
        "https://anirudhkille.github.io/nike-landing-page/assets/shoe4-ITTu7E0E.svg",
      price: 170,
    },
    {
      id: "2",
      title: "Nike React Infinity Run Flyknit 3",
      imageUrl:
        "https://anirudhkille.github.io/nike-landing-page/assets/shoe5-7-zrw4nw.svg",
      price: 180,
    },
    {
      id: "3",
      title: "Nike Dunk Low",
      imageUrl:
        "https://anirudhkille.github.io/nike-landing-page/assets/shoe6-hPwIYIrH.svg",
      price: 110,
    },
    {
      id: "4",
      title: "Nike Air Force 1 '07",
      imageUrl:
        "https://anirudhkille.github.io/nike-landing-page/assets/thumbnail-shoe2-uPtbhEJp.svg",
      price: 130,
    },
  ];

  const hasItemsInWishlist = wishlistItems.length > 0;

  return (
    <>
      {!hasItemsInWishlist ? (
        <EmptyPage
          text1="Your Wishlist is empty."
          text2="Save your favorite items and they'll appear here."
          Icon={Heart}
        />
      ) : (
        <Container extraStyle={styles.container}>
          <FlatList
            data={wishlistItems}
            keyExtractor={(item) => item.id}
            numColumns={2} scrollEnabled
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleItemPress(item)}
                style={[
                  styles.itemContainer,
                  { backgroundColor: themeColors.background },
                ]}
              >
                <View
                  style={[
                    styles.imageContainer,
                    { backgroundColor: themeColors.accent },
                  ]}
                >
                  <Image
                    source={item.imageUrl}
                    style={styles.image}
                    transition={1000}
                  />
                  <TouchableOpacity
                    style={[
                      styles.heart,
                      { backgroundColor: themeColors.background },
                    ]}
                  >
                    <Heart color={themeColors.primary} size={20} />
                  </TouchableOpacity>
                </View>

                <View style={styles.textContainer}>
                  <Text size={18} weight="600">
                    {item.title}
                  </Text>
                  <Text color="accent">₹{item.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            )}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={styles.listContent}
          />
        </Container>
      )}

      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["40%", "70%"]}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={{ padding: 20 }}>
            {selectedItem && (
              <>
                <Image
                  source={selectedItem.imageUrl}
                  style={{
                    width: width - 40,
                    height: width - 40,
                    borderRadius: 10,
                    marginBottom: 20,
                  }}
                />
                <Text size={22} weight="600">
                  {selectedItem.title}
                </Text>
                <Text size={18} color="accent">
                  ₹{selectedItem.price.toFixed(2)}
                </Text>
              </>
            )}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 999,
  },
  textContainer: {
    padding: 10,
    alignItems: "flex-start",
    gap: 5,
  },
});
