import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const myCards = [
  {
    id: "1",
    title: "Diseñar pantalla de login",
    description: "Falta agregar validación de correo.",
    due: "5/19/2025",
  },
  {
    id: "2",
    title: "Revisar feedback del cliente",
    description: "Notas del sprint pasado.",
    due: "5/28/2025",
  },
  {
    id: "3",
    title: "Agregar animación de carga",
    description: "Para la pantalla de inicio.",
    due: "6/15/2025",
  },
];

const Cards = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Tarjetas</Text>
      <FlatList
        data={myCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="checkmark-done-circle-outline" size={22} color="#4A4A4A" />
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.due}>📅 Creado {item.due}</Text>
          </View>
        )}
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
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  due: {
    fontSize: 12,
    color: "#999",
    marginTop: 10,
  },
});
