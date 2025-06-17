import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
const Page = () => {
  const [boardName, setBoardName] = useState("");
  const router = useRouter();

  const onCreateBoard = async () => {};
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
      <Link href="/(auth)/(tabs)/boards/new-board/color-select">Open Page</Link>
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
});

export default Page;
