import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import DraggableNotionList from "@/components/draggable/DraggableNotionList";
import { View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { useNavigationState } from "@react-navigation/native";

export default function Home() {
  const { userId } = useAuth();
  const navigationState = useNavigationState((state) => state);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    supabase.auth.startAutoRefresh();
    return () => {
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  useEffect(() => {
    setRenderKey((prevKey) => prevKey + 1);
  }, [navigationState?.index]);

  return (
    <View style={{ padding: 24, flex: 1 }}>
      <ThemedText type="title">Start Building Flatlist</ThemedText>
      <DraggableNotionList key={`draggable-${renderKey}`} />
      <Button onPress={() => console.log(userId)}>Show UserId</Button>
    </View>
  );
}
