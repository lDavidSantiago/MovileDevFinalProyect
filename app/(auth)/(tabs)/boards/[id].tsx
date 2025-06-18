import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";
import { Board } from "@/types/enums";
import { BlurView } from "expo-blur"; // Ensure you have installed expo-blur
const Page = () => {
  const { id, bg } = useLocalSearchParams<{ id: string; bg?: string }>();
  const { getBoardInfo } = useSupabase();
  const [board, setBoard] = useState<Board>();
  useEffect(() => {
    if (!id) return;
    loadBoardInfo();
  }, [id]);

  const loadBoardInfo = async () => {
    const data = await getBoardInfo!(id);
    console.log("Board Info:", data);
    setBoard(data);
  };
    const CustomHeader = () =>{
      <BlurVew
    }
  return (
    <View style={{ backgroundColor: bg, flex: 1, padding: 20 }}>
      <Text>Page</Text>
      <BlurView intensity={100} style={{ flex: 1 }} />
      <Stack.Screen
        options={{
          title: board?.title,
        }}
      />
    </View>
  );
};

export default Page;
