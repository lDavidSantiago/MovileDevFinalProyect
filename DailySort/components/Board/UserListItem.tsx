import { Colors } from "@/constants/Colors";
import { User } from "@/types/enums";

import React from "react";
import {
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
interface UserListItemProps {
  element: ListRenderItemInfo<User>;
  onPress?: (user: User) => void;
}
const UserListItemProps = ({
  element: { item },
  onPress,
}: UserListItemProps) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        paddingTop: 8,
      }}
      onPress={() => onPress?.(item)}
    >
      <Image
        source={{ uri: item.avatar_url }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <View>
        <Text style={{ fontSize: 16, fontWeight: "semibold" }}>
          {item.first_name}
        </Text>
        <Text style={{ color: Colors.grey }}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserListItemProps;

const styles = StyleSheet.create({});
