import { ThemedText } from "@/components/ThemedText";
import { Linking, View } from "react-native";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-expo";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { router } from "expo-router";

export default function Home() {
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      router.replace("/(auth)");
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  const { signOut } = useClerk();
  return (
    <BodyScrollView contentContainerStyle={{ padding: 24 }}>
      <ThemedText type="title">Home In</ThemedText>
      <Button onPress={handleSignOut} style={{ marginTop: 16 }}>
        Sign Out
      </Button>
    </BodyScrollView>
  );
}
