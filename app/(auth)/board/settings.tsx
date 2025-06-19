import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Board } from "@/types/enums";
import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getBoardInfo, updateBoard, deleteBoard } = useSupabase();
  const router = useRouter();
  const [board, setBoard] = useState<Board>();
  useEffect(() => {
    if (!id) return;
    loadInfo();
  }, [id]);

  const loadInfo = async () => {
    const data = await getBoardInfo!(id);
    setBoard(data);
  };
  const onUpdateBoardInfo = async () => {
    const updated = await updateBoard!(board!);
    setBoard(updated);
  };
  const onDeleteBoard = async () => {
    await deleteBoard!(`${id}`);
    router.dismissAll();
  };
  return (
    <View>
      <View style={styles.container}>
        <View>
          <Text style={{ color: Colors.grey, fontSize: 12, marginBottom: 5 }}>
            Board name
          </Text>
          <TextInput
            value={board?.title}
            onChangeText={(text) => setBoard({ ...board!, title: text })}
            style={{ fontSize: 16, color: Colors.fontDark }}
            placeholder="Add new board name"
            returnKeyType="done"
            enterKeyHint="done"
            onEndEditing={onUpdateBoardInfo}
          />
        </View>
        <View style={styles.container}>
          <View style={{ flexDirection: "row", gap: 14 }}>
            <Ionicons name="person-outline" size={18} color="#000000" />
            <Text
              style={{
                fontWeight: "bold",
                color: Colors.grey,
                fontSize: 16,
              }}
            >
              Members
            </Text>
          </View>
          {/* Add a button to manage members */}
          <Link
            href={{
              pathname: "/(auth)/board/invite",
              params: { id: id },
            }}
            asChild
          >
            <TouchableOpacity style={styles.fullBtn}>
              <Text style={{fontSize:16,color:Colors.fontLight}}>Manage Members</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <TouchableOpacity onPress={onDeleteBoard} style={styles.deleteBtn}>
        <Text style={{ color: " #c70000" }}>Delete Board</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 8,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  deleteBtn: {
    backgroundColor: "#fff",
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  fullBtn: {
    backgroundColor: Colors.blue,
    padding: 8,
    marginLeft: 32,
    marginRight: 16,
    marginTop: 8,
    borderRadius: 6,
    alignItems: "center",
  },
});
