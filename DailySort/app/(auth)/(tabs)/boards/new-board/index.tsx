import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { DEFAULT_COLOR } from "./color-select";
import { useSupabase } from "@/context/SupabaseContext";

const Page = () => {
  const { createBoard } = useSupabase();
  const [boardName, setBoardName] = useState("");
  const router = useRouter();
  const { bg } = useGlobalSearchParams<{ bg?: string }>();
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  useEffect(() => {
    if (bg) {
      setSelectedColor(bg);
    }
  }, [bg]);
  const onCreateBoard = async () => {
    await createBoard!(boardName, selectedColor);
    router.dismiss();
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Stack.Screen
        options={{
          headerTitle: "Board",
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={onCreateBoard}
              disabled={boardName === ""}
            >
              <Text
                style={
                  boardName === "" ? styles.btnTextDisabled : styles.btnText
                }
              >
                Create
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TextInput
        style={styles.input}
        value={boardName}
        onChangeText={setBoardName}
        placeholder="New Board"
        autoFocus
      />
      <Link href="/(auth)/(tabs)/boards/new-board/color-select" asChild>
        <TouchableOpacity style={styles.btnItem}>
          <Text style={styles.btnItemText}>Background</Text>
          <View
            style={[styles.colorPreview, { backgroundColor: selectedColor }]}
          />
          <Ionicons name="chevron-forward" size={22} color={Colors.grey} />
        </TouchableOpacity>
      </Link>
    </View>
  );
};
const styles = StyleSheet.create({
  btnTextDisabled: {
    fontSize: 18,
    fontWeight: 500,
    color: Colors.grey,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.blue,
  },
  input: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    backgroundColor: "white",
    padding: 12,
    paddingHorizontal: 24,
    fontSize: 16,
    marginBottom: 32,
  },
  btnItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
  },
  btnItemText: {
    fontSize: 16,
    flex: 1,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
});

export default Page;
