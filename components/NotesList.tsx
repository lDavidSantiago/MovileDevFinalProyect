import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { View, Text } from "react-native";
export function NotesList(userId: string) {
    const notes = useQuery(api.notionFiles.getNotionFilesByUserId, {
        userId
    });
    return(
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {notes?.map((note) => (
                <View key={note._id}>
                    <Text>{note.title}</Text>
                    <Text>{note.description}</Text>
                </View>
            ))}
        </View>
    )
}
