import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

const Account = () => {
  const { signOut } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
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
