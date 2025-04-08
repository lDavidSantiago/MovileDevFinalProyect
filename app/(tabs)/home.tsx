import { Modal, Text, View, TouchableOpacity, Button} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/tabs.styles";
import { useState } from "react";
import  CalendarOption  from "@/components/calendar";
import { mutation } from "@/convex/_generated/server";
import { NotesList } from "@/components/NotesList";

export default function Index() {
  const { user } = useUser();
  const createNotionMutation = useMutation(api.notionFiles.createNotionFile);
  const auth = useAuth();
  const userId = user?.id?.toString() || "";
  
  const notes = useQuery(api.notionFiles.getNotionFilesByUserId, { userId });
  const handleCreateTestNotion = () => {
    if (!user) {
      alert("You need to be logged in to create a notion file");
      return;
    }
    
    // Call the mutation with test data
    createNotionMutation({
      title: "Test Notion File",
      description: "This is a test description",
      content: "This is the content of the test notion file",
      type: "document",
      coverPhoto: "https://picsum.photos/200/300", // Random image
      icon: "📄", // Document icon
      parentFileId: undefined, // No parent (root level)
      order: 0
    })
    .then(fileId => {
      console.log("Successfully created file with ID:", fileId);
      alert("Test notion file created successfully!");
    })
    .catch(error => {
      console.error("Error creating notion file:", error);
      alert(`Failed to create test file: ${error.message}`);
    });
  };
  
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => console.log({id: user?.id, test: auth.userId})}>
          <Text style={styles.buttonText}>
          TEST</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateTestNotion}>  {/* Fixed this line too */}
        <Text style={styles.buttonText}>Create Notion File</Text>
      </TouchableOpacity>
            {notes?.map((note) => (
                <View key={note._id}>
                    <Text>{note.title}</Text>
                    <Text>{note.description}</Text>
                </View>
            ))}
    </View>
  );
}
