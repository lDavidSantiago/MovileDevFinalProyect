import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabaseClient";
import { AppState } from "react-native";
import { Button } from "@/components/ui/button";
import DraggableNotionList from "@/components/draggable/DraggableNotionList";
import { View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Home() {
  const { userId } = useAuth();
  return (
    <View style={{ padding: 24, flex: 1 }}>
      <ThemedText type="title">Start Building Flatlist</ThemedText>
      <DraggableNotionList />
      <Button onPress={() => console.log(userId)}>Show UserId</Button>
    </View>
  );
}
