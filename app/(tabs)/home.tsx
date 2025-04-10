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
  const userId = user?.id?.toString() || "";
  const notes = useQuery(api.notionFiles.getNotionFilesByUserId, { userId });
  const [data,setData] = useState<typeof notes>([]);

  useEffect(() =>{
    if (notes){
      setData(notes);
    }
  },[notes])
  const handleCreateTestNotion = () => {
    if (!user) {
      alert("You need to be logged in to create a notion file");
      return;
    }
    
    // Call the mutation with test data
    createNotionMutation({
      title: "Hola",
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
        <TouchableOpacity disabled={isActive} onLongPress={drag} >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      );
    },
    []
  );
  return (
    <View style={styles.container}>
      {notes?.map((note) => (
                <View key={note._id}>
                    <Text>{note.icon} {note.title}</Text>
                    <Text>{note.description}</Text>
                </View>
            ))}
        <TouchableOpacity onPress={() => console.log(router.replace("/(create)/createNotion"))}>
          <Text style={styles.buttonText}>Go To CreateNotion</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateTestNotion}>  
        <Text style={styles.buttonText}>Create Notion File</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log("Data: ", data)}>
        <Text style={styles.buttonText}>Log Notes</Text>
      </TouchableOpacity>
      
      <DraggableFlatList
        data={data || []}
        containerStyle={{flex:1}}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
            
         
    </View>
  );
}


