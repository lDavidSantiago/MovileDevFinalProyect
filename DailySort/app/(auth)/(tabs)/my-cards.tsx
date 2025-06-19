import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "expo-router";
import { Task } from "@/types/enums";

const Cards = () => {
  const { getCreatedCards } = useSupabase() as {
    getCreatedCards: () => Promise<Task[]>;
  };
  const [cards, setCards] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadCards = async () => {
      const data = await getCreatedCards();
      console.log("Tarjetas recibidas:", data);
      setCards(data);
    };
    loadCards();
  }, []);

  const openCard = (id: string) => {
    router.push(`/board/card/${id}`);
  };

  const renderCard = ({ item }: { item: Task }) => {
    const user = item.users;
    return (
      <TouchableOpacity onPress={() => openCard(item.id)} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={20} color="#4A4A4A" />
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.description}>
          {item.description || "Sin descripción"}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.due}>
            📅 {new Date(item.created_at).toLocaleDateString()}
          </Text>
          {user && (
            <View style={styles.userInfo}>
              {user.avatar_url && (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={styles.avatar}
                />
              )}
              <Text style={styles.username}>{user.first_name}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Tarjetas</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        ListEmptyComponent={
          <Text style={styles.noResults}>
            No has creado ninguna tarjeta aún.
          </Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
};

export default Cards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  due: {
    fontSize: 12,
    color: "#999",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  username: {
    fontSize: 12,
    color: "#333",
  },
  noResults: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
});
