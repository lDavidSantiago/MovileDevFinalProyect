import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Board } from "@/types/enums";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur"; // Ensure you have installed expo-blur
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Page = () => {
  const { id, bg } = useLocalSearchParams<{ id: string; bg?: string }>();
  const { getBoardInfo } = useSupabase();
  const [board, setBoard] = useState<Board>();
  const { top } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  useEffect(() => {
    if (!id) return;
    loadBoardInfo();
  }, [id]);

  const loadBoardInfo = async () => {
    const data = await getBoardInfo!(id);
    console.log("Board Info:", data);
    setBoard(data);
  };
  const CustomHeader = () => (
    <BlurView intensity={80} tint="dark" style={{ paddingTop: top }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.dismiss()}>
          <Ionicons name="close" size={24} color={Colors.fontLight} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ color: Colors.fontLight, fontSize: 16 }}>
            {board?.title}
          </Text>
          <Text style={{ color: Colors.fontLight, fontSize: 12 }}>
            Workspace of {board?.users.first_name}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 13 }}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="filter-circle-outline"
              size={24}
              color={Colors.fontLight}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.fontLight}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color={Colors.fontLight}
            />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );

  return (
    <View style={{ backgroundColor: bg, flex: 1, paddingTop: headerHeight }}>
      <Text>Page</Text>
      <Stack.Screen
        options={{
          title: board?.title,
          headerTransparent: true,
          header: CustomHeader,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 14,
    height: 50,
  },
});

export default Page;
