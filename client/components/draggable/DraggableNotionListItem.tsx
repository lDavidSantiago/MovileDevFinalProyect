import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { NotionFile } from "./DraggableNotionList";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { supabase } from "@/lib/supabaseClient";
import LoadingTextAnimation from "../ui/animateDots";
import { useActionSheet } from "@expo/react-native-action-sheet";
interface DraggableNotionListItemProps
  extends Omit<RenderItemParams<NotionFile>, "getIndex"> {
  getData: () => Promise<void>;
}
export function DraggableNotionListItem({
  drag,
  isActive,
  item,
  getData, // Pass the getData function as a prop
}: DraggableNotionListItemProps) {
  const iconColor = "#888"; // You can adjust this default color or make it a prop

  return (
    <NotionFileItem
      iconColor={iconColor}
      notionFile={item}
      drag={drag}
      isActive={isActive}
      getData={getData} // Pass the getData function to NotionFileItem
    />
  );
}

interface InnerNotionFileItemProps {
  parentId: number | undefined;
}

function InnerNotionListItem({ parentId }: InnerNotionFileItemProps) {
  const [childFiles, setChildFiles] = useState<NotionFile[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchChilds = async () => {
      setIsLoading(true); // Set loading to true before fetching

      const { data, error } = await supabase
        .from("notionfile")
        .select("*")
        .eq("parentfileid", parentId)
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Data fetched successfully:", data);
        setChildFiles(data || []);
      }
      setIsLoading(false); // Set loading to false after fetching
    };

    fetchChilds();
  }, [parentId]);
  if (isLoading) {
    return <LoadingTextAnimation />; // Use the animated loading text
  }

  if (childFiles.length === 0)
    return <ThemedText style={{ color: "gray" }}>No pages inside!</ThemedText>;
  return (
    <View>
      {childFiles.map((child) => (
        <NotionFileItem key={child.id} iconColor="#888" notionFile={child} />
      ))}
    </View>
  );
}

interface NotionFileItemProps {
  drag?: () => void;
  isActive?: boolean;
  notionFile: NotionFile;
  iconColor: string;
  getData?: () => Promise<void>; // Add getData prop
}

function NotionFileItem({
  iconColor,
  isActive,
  notionFile,
  drag,
  getData,
}: NotionFileItemProps) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [isOpen, SetIsOpen] = useState(false);
  const onPress = (id: number) => {
    const options = ["Delete", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case destructiveButtonIndex: {
            supabase
              .from("notionfile")
              .delete()
              .eq("id", id)
              .then(({ data, error }) => {
                if (error) {
                  console.error("Error deleting data:", error);
                } else {
                  console.log("Data deleted successfully:", data);
                }
              });
            // Optionally, you can refresh the list or perform any other action after deletion
            if (getData) {
              getData(); // Call the getData function to refresh the list
            }
            break;
          }
          case cancelButtonIndex: {
            // Handle cancel action if needed
            break;
          }
        }
      }
    );
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        activeOpacity={0.8}
        disabled={isActive}
        onLongPress={drag}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable onPress={() => SetIsOpen((value) => !value)}>
            <Ionicons
              name={isOpen ? "chevron-down" : "chevron-forward-outline"}
              size={19}
              style={{ marginRight: 12 }}
              color={iconColor}
            />
          </Pressable>
          <ThemedText type="defaultSemiBold">
            {notionFile.icon}
            {notionFile.title}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Pressable onPress={() => onPress(notionFile.id)}>
            <Ionicons
              name={"ellipsis-horizontal"}
              size={18}
              color={iconColor}
            />
          </Pressable>
          <Ionicons name={"add"} size={22} color={iconColor} />
        </View>
      </TouchableOpacity>
      {isOpen ? (
        <View style={styles.content}>
          <InnerNotionListItem parentId={notionFile.id} />
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  heading: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    // borderColor: "white",
  },
  content: {
    marginLeft: 24,
  },
});
