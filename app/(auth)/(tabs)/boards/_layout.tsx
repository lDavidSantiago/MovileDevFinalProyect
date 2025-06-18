import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import DropdownMenu from "@/components/DropdownMenu";
import { MenuOption } from "@/components/MenuOption";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const Layout = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "DailySort",
          headerRight: () => (
            <DropdownMenu
              visible={visible}
              handleOpen={() => setVisible(true)}
              handleClose={() => setVisible(false)}
              trigger={
                <View style={styles.triggerStyle}>
                  <Text style={styles.triggerText}>New</Text>
                  <Ionicons name="add" size={24} color="black" />
                </View>
              }
            >
              <MenuOption
                onSelect={() => {
                  console.log("Crear tablero 🗣️🗣️");
                  setVisible(false);
                  router.push("/(auth)/(tabs)/boards/new-board");
                }}
              >
                <View style={styles.rowContainer}>
                  <Text style={styles.text}>Create board</Text>
                  <Ionicons name="create-outline" size={18} color="black" />
                </View>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  console.log("Crea Cartica ♥️♦️♠️");
                  setVisible(false);
                  router.push("/(auth)/(tabs)/boards/new-board");
                }}
              >
                <View style={styles.rowContainer}>
                  <Text style={styles.text}>Create Card</Text>
                  <Ionicons name="create-outline" size={18} color="black" />
                </View>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  console.log("Borra la cuenta 🗣️🗣️");
                  setVisible(false);
                  router.push("/(auth)/(tabs)/boards/templates");
                }}
              >
                <View style={styles.rowContainer}>
                  <Text style={styles.text}>Templates</Text>
                  <Ionicons
                    name="tablet-landscape-outline"
                    size={18}
                    color="black"
                  />
                </View>
              </MenuOption>
            </DropdownMenu>
          ),
        }}
        //TODO: ADD CUSTOM HEADER
      />
      <Stack.Screen
        name="new-board"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="templates"
        options={{
          title: "Start with a template",

          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 10 }}
            >
              <Ionicons name="close" size={16} color="black" />
            </TouchableOpacity>
          ),
          presentation: "modal",
        }}
      />
    </Stack>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  triggerStyle: {
    height: 40,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center", // Alinea verticalmente en el centro
    gap: 8, // Espacio entre el texto y el icono (puedes ajustar este valor)
  },
  text: {
    fontSize: 16,
  },
  triggerText: {
    padding: 2,
    fontSize: 16,
  },
});
export default Layout;
