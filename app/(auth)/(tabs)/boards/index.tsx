import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Board } from "@/types/enums";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Page = () => {
  const { getBoards } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      loadBoards();
    }, [])
  );
  const loadBoards = async () => {
    console.log("Loading boards...");
    const data = await getBoards!();
    setBoards(data);
  };
  const ListItem = ({ item }: { item: Board }) => (
    <Link
      href={{
        pathname: "/(auth)/board/[id]",
        params: { id: item.id, bg: item.background },
      }}
      key={item.id}
      style={styles.listItem}
      asChild
    >
      <TouchableOpacity onPress={() => console.log("Board pressed:", item)}>
        <View
          style={[styles.colorBlock, { backgroundColor: item.background }]}
        />
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.title}</Text>
        <Text
          style={{
            color: Colors.grey,
            marginTop: 4,
            textAlign: "right", // Esto alinea el texto a la derecha
          }}
        >
          Created on date: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Link>
  );
  return (
    <View>
      <FlatList
        data={boards}
        contentContainerStyle={boards.length > 0 && styles.list}
        renderItem={ListItem}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.grey,
              marginStart: 50,
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadBoards} />
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  list: {
    borderColor: Colors.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    gap: 10,
  },
  colorBlock: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});
export default Page;
