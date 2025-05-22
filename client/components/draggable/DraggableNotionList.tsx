/* eslint-disable @typescript-eslint/no-unused-vars */
import DraggableFlatList from "react-native-draggable-flatlist";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DraggableNotionListItem } from "./DraggableNotionListItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "@clerk/clerk-expo";
export interface NotionFile {
  id: number;
  creator: string;
  title: string;
  icon: string;
  text: string;
  parentfileid: string | null;
  order: number;
  created_at: string;
  updated_at: string;
  // Add other columns as needed, with their respective types
}
export default function DraggableNotionList() {
  const [datos, setData] = useState<NotionFile[]>([]);
  const [sortedFiles, setSortedFiles] = useState<NotionFile[]>([]);
  const { userId } = useAuth();

  async function getData() {
    const { data, error } = await supabase
      .from("notionfile")
      .select("*")
      .eq("creator", userId) // Use the userId from useAuth
      .is("parentfileid", null)
      .order("order", { ascending: true });
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      if (data && data.length > 0) {
        console.log("Data fetched successfully:aaaa", data);
        setData(data);
      } else {
        console.log("No data found");
        setData([]); // Set data to an empty array if no data is returned
      }
    }
  }
  useEffect(() => {
    getData();
  }, []);

  const handleDragEnd = async (data: NotionFile[]) => {
    // Update the order in the database for each item
    setSortedFiles(data);
    for (const [index, item] of data.entries()) {
      const { error } = await supabase
        .from("notionfile")
        .update({ order: index })
        .eq("id", item.id);

      if (error) {
        console.error(`Error updating order for item ${item.id}:`, error);
      } else {
        console.log(`Updated order for item ${item.id} to ${index}`);
      }
    }

    // Refresh the data after updating
    getData();
  };

  return (
    <GestureHandlerRootView>
      <DraggableFlatList
        data={datos}
        containerStyle={{ flex: 1 }}
        onDragEnd={({ data }) => {
          handleDragEnd(data);
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, drag, isActive }) => (
          <DraggableNotionListItem
            drag={drag}
            item={item}
            isActive={isActive}
            getData={getData}
          />
        )}
      />
    </GestureHandlerRootView>
  );
}
