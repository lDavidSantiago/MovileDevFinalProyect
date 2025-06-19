import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const Search = () => {
  const { getBoards } = useSupabase();
  const [searchText, setSearchText] = useState("");
  const [boards, setBoards] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // 👇 Se ejecuta cada vez que entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      loadBoards();
    }, [])
  );

  const loadBoards = async () => {
    setRefreshing(true);
    const data = await getBoards!();
    setBoards(data);
    setFiltered(
      data.filter((board: any) =>
        board.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredData = boards.filter((board) =>
      board.title.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const goToBoard = (boardId: string) => {
    router.push(`/board/${boardId}`); // ajusta si tu ruta es diferente
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buscar Tableros</Text>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Escribe para buscar..."
          style={styles.input}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={loadBoards}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => goToBoard(item.id)}
          >
            <Ionicons name="grid-outline" size={20} color="#4A4A4A" />
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>No se encontraron tableros</Text>
        }
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#F7F7F7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  itemText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  noResults: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
