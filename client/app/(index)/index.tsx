import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function Home() {
  const { isSignedIn } = useAuth();
  console.log(isSignedIn);
  
  return isSignedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
}
