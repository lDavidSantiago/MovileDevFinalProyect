import { Text, View, TouchableOpacity, Button,} from "react-native";
import {  useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/tabs.styles";
import { router } from 'expo-router';
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import React, { useCallback, useEffect, useState } from "react";


export default function Index() {
  const { user } = useUser();
  const createNotionMutation = useMutation(api.notionFiles.createNotionFile);
  const updateFileOrders = useMutation(api.notionFiles.updateFileOrders); // Move this to the top level
  const userId = user?.id?.toString() || "";
  const notes = useQuery(api.notionFiles.getNotionFilesByUserId, { userId });
  const [data, setData] = useState<typeof notes>([]);
  const [sortedFiles, setSortedFiles] = useState<typeof notes>([]);

  useEffect(() =>{
    if (notes) {
      setSortedFiles(notes);
    }
  }, [notes])
  const handleCreateTestNotion = () => {
    if (!user) {
      alert("You need to be logged in to create a notion file");
      return;
    }   
    createNotionMutation({
      title: "Test 3",
      description: "This is a test description",
      content: "This is the content of the test notion file",
      type: "document",
      coverPhoto: "https://picsum.photos/200/300", // Random image
      icon: "📄", // Document icon
      order: 2
    })
    .then(fileId => {
      console.log("Successfully created file with ID:", fileId);
      alert("Test notion file created successfully! File ID: " + fileId);
    })
    .catch(error => {
      console.error("Error creating notion file:", error);
      alert(`Failed to create test file: ${error.message}`);
    });
  };
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<any>) => {
      return (
        <TouchableOpacity disabled={isActive} onLongPress={drag} onPress={() => console.log(item)}>
          <Text style={{fontSize: 20}}>{item.icon}{item.title}</Text>
        </TouchableOpacity>
      );
    },
    []
  );

  const handleDragEnd = async (data: any[]) => {
     // Update local state immediately for a smooth UI experience
     setSortedFiles(data);
  
     // Create updates array
     setTimeout(async () => {
      try {
        const updates = data.map((item, index) => ({
          id: item._id,
          order: index
        }));
        
        await updateFileOrders({ updates });
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }, 300); // Delay matches animation duration
  }
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => console.log(router.replace("/(create)/createNotion"))}>
          <Text style={styles.buttonText}>Go To CreateNotion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateTestNotion}>
          <Text style={styles.buttonText}>Create Test Notion</Text>
        </TouchableOpacity>
      <DraggableFlatList
        data={sortedFiles || []}
        containerStyle={{flex:1}}
        onDragEnd={({ data }) => handleDragEnd(data)}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        activationDistance={1}
        
      />
    </View>
  );
}



