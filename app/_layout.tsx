import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLyout from "@/components/initialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndCovexProviders";
import {ThemeProvider} from '@/providers/themeContext';
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}


export default function RootLayout() {
  return (
    <ThemeProvider>
        <ClerkAndConvexProvider>
          <SafeAreaProvider style ={styles.container}>
            <SafeAreaView style={{ flex:1 ,backgroundColor:"#000"}}>
              {/*Check if user is logged in or not*/}
              <GestureHandlerRootView>
              <InitialLyout/> 
              </GestureHandlerRootView>
              
            </SafeAreaView>
          </SafeAreaProvider>
      </ClerkAndConvexProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  }
});