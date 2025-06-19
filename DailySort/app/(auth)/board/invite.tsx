import UserListItem from "@/components/Board/UserListItem";
import { useSupabase } from "@/context/SupabaseContext";
import { User } from "@/types/enums";
import { useHeaderHeight } from "@react-navigation/elements";
import { DefaultTheme } from "@react-navigation/native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const InvitePage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findUsers, addUserToBoard } = useSupabase();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState<User[]>([]);
  const headerHeight = useHeaderHeight();

  const onSearchUser = async () => {
    console.log("ADDIDNG USER: ", search);
    const users = await findUsers!(search);
    setUserList(users);
    console.log("FOUND USERS: ", users);
  };
  const onAddUser = async (user: User) => {
    await addUserToBoard!(id, user.id);
    router.dismiss();
  };

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: DefaultTheme.colors.background,
          },
          headerSearchBarOptions: {
            inputType: "email",
            autoCapitalize: "none",
            autoFocus: true,
            placeholder: "Invite by name, username or email",
            cancelButtonText: "Done",
            onChangeText: (e) => setSearch(e.nativeEvent.text),
          },
        }}
      />
      <View>
        <TouchableOpacity onPress={() => console.log(onSearchUser())}>
          <Text>TEST</Text>
        </TouchableOpacity>
        <FlatList
          data={userList}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 60 + headerHeight }}
          contentContainerStyle={{ gap: 8 }}
          renderItem={(item) => (
            <UserListItem
              element={item}
              onPress={() => {
                onAddUser(item.item);
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

export default InvitePage;

const customStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  doneButton: {
    backgroundColor: "#007AFF", // Example: iOS-style blue
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  doneButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
