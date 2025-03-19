import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLyout from "@/components/initialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndCovexProviders";


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}


export default function RootLayout() {
  return (
      <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex:1 ,backgroundColor:"#000"}}>
            {/*Check if user is logged in or not*/}
            <InitialLyout/> 
          </SafeAreaView>
        </SafeAreaProvider>
        </ClerkAndConvexProvider>

  );
}