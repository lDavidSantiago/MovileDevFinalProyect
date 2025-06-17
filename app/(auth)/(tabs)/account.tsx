import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

const Account = () => {
  const { signOut } = useAuth();
  const handleLogout = async () => {
    console.log("Attempting to log out..."); // <--- AÑADE ESTO
    try {
      await signOut();
      console.log("Usuario desconectado exitosamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={() => handleLogout()}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Account;
