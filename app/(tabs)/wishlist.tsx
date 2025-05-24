import React, { useRef, useState, useEffect } from "react";
import EmptyPage from "@/components/shared/EmptyCart";
import { Image } from "expo-image";
import Container from "@/layout/Container";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "@/components/ui/Text";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useThemeStore } from "@/store/theme";
import { colors } from "@/constant/color";
import { HeartIcon } from "@/assets/icons/HeartIcon";
import Button from "@/components/ui/Button";

interface WishlistItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
}

export default function Wishlist() {
  const { appliedTheme } = useThemeStore();
  const themeColors = colors[appliedTheme];

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);

  const handleItemPress = (item: WishlistItem) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (selectedItem) {
      bottomSheetRef.current?.expand();
    }
  }, [selectedItem]);

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
          Icon={HeartIcon}
        />
      ) : (
        <Container extraStyle={styles.container}>
          <FlatList
            data={wishlistItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled
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
                    contentFit="cover"
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
                    <HeartIcon
                      color={themeColors.primary}
                      fill={themeColors.primary}
                      size={18}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.textContainer}>
                  <Text weight="500">{item.title}</Text>
                  <Text size={14} color="accent">
                    ₹{item.price.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={styles.listContent}
          />
        </Container>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        handleIndicatorStyle={{ display: "none" }}
        handleStyle={{ backgroundColor: themeColors.background }}
        snapPoints={[10, 10]}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView
          style={{
            padding: 20,
            gap: 20,
            backgroundColor: themeColors.background,
          }}
          hitSlop={1}
        >
          {selectedItem && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "flex-start",
                  paddingBottom: 20,
                }}
              >
                <Image
                  source={selectedItem.imageUrl}
                  contentFit="cover"
                  style={{
                    width: "50%",
                    height: 150,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text weight="600" color="primary">
                    {selectedItem.title}
                  </Text>
                  <Text size={14} color="accent">
                    ₹{selectedItem.price.toFixed(2)}
                  </Text>
                </View>
              </View>

              <Button
                text="Add to Cart"
                onPress={() => {
                  alert(`Added ${selectedItem.title} to cart`);
                  bottomSheetRef.current?.close();
                }}
              />
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
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
