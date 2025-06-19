import { Task } from "@/types/enums";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
const ListItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
  const openLink = () => {
    router.push(`/board/card/${item.id}`);
  };
  const router = useRouter();
  return (
    <ScaleDecorator>
      <TouchableOpacity
        onPress={openLink}
        onLongPress={drag}
        disabled={isActive}
        style={[styles.rowItem, { opacity: isActive ? 0.5 : 1 }]}
      >
        {!item.image_url && (
          <View>
            <Text>{item.title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  rowItem: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
});
