import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
const Layout = () => {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="board/settings"
        options={{
          title: "Board Settings",

          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={18} color="black" />
            </TouchableOpacity>
          ),
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default Layout;
