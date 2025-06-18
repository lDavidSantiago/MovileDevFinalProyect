import { TaskList } from "@/types/enums";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ViewListProps {
  taskList: TaskList;
}
const ViewList = ({ taskList }: ViewListProps) => {
  const [listName, setListName] = useState(taskList.title);
  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 30 }}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.listTitle}>{listName}</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ViewList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F3EFFC",
    borderRadius: 4,
    padding: 6,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    alignItems: "center",
  },
  listTitle: {
    paddingVertical: 8,
    fontWeight: "500",
  },
});
