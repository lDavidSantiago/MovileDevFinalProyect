import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
export default function TabTwoScreen() {
  const { signOut, user } = useClerk();

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
  return (
    <View style={styles.container}>
      <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
      <ThemedText style={styles.name} type="title">
        {user?.firstName} {user?.lastName}
      </ThemedText>
      <ThemedText style={styles.email} type="default">
        {user?.emailAddresses[0].emailAddress}
      </ThemedText>
      <Button onPress={handleSignOut} style={styles.signOutButton}>
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 24,
  },
  signOutButton: {
    marginTop: 16,
    width: "80%",
  },
});
