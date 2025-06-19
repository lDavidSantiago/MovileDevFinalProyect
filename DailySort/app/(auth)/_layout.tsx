import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { DefaultTheme } from '@react-navigation/native';
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
      
      <Stack.Screen
        name="board/card/[id]"
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
        }}
      />
    </Stack>
  );
};

export default Layout;
