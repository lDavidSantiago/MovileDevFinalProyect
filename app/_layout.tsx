import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLyout from "@/components/initialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndCovexProviders";
import {ThemeProvider} from '@/providers/themeContext';
import { useTheme } from '@/providers/themeContext';


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}


export default function RootLayout() {
  const {darkMode} = useTheme();
  return (
    <ThemeProvider>
        <ClerkAndConvexProvider>
          <SafeAreaProvider style ={styles.container}>
            <SafeAreaView style={{ flex:1 ,backgroundColor: darkMode? "#000" : "#fff"}}>
              {/*Check if user is logged in or not*/}
              <InitialLyout/> 
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