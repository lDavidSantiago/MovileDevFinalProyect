import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@/cache";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Clerk keys
const publisableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publisableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publisableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style={colorScheme === "dark" ? "dark" : "light"} />
          <SafeAreaView style={styles.container}>
            <ActionSheetProvider>
              <Slot />
            </ActionSheetProvider>
          </SafeAreaView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
