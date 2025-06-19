import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const fakeNotifications = [
  {
    id: "1",
    icon: "notifications",
    title: "Tarea asignada",
    description: "Se te ha asignado la tarea 'asap'.",
    time: "6/18/2025",
  },
  {
    id: "2",
    icon: "person-add",
    title: "Nuevo miembro en el tablero",
    description: "Ganzolitario se unió a tu proyecto 'DailySort'.",
    time: "6/18/2025",
  },
  {
    id: "3",
    icon: "cloud-download",
    title: "Actualización disponible",
    description: "Una nueva versión de la app está lista para instalar.",
    time: "6/18/2025",
  },
];

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      <FlatList
        data={fakeNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Ionicons name={item.icon as any} size={24} color="#4A4A4A" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default Notifications;

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
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  time: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 6,
  },
  separator: {
    height: 12,
  },
});
