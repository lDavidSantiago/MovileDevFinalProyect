import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { useRouter, useSegments, Stack } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY as string;

const InitialLayout = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === "(auth)";
    console.log("Segments:", segments);
    console.log("isSignedIn:", isSignedIn);
    console.log("inAuthGroup:", inAuthGroup);
    if (isSignedIn && !inAuthGroup) {
      // If the user is signed in and in the auth group, redirect to the home page
      console.log(
        "User is signed in and in the auth group, redirecting to boards"
      );
      router.replace("/(auth)/(tabs)/boards");
    } else if (!isSignedIn) {
      // If the user is not signed in and not in the auth group, redirect to the auth page
      router.replace("/");
    }
  }, [isSignedIn, isLoaded, segments, router]);
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} color="#0000ff" />
      </View>
    );
  }
  return (
    <SupabaseProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </SupabaseProvider>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <StatusBar style="light" />
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <InitialLayout />
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </ClerkProvider>
  );
};

export default RootLayoutNav;
