import { View,Text, TouchableOpacity } from "react-native"
import { router } from 'expo-router';



export default function CreateNotion() {
    return (
        <View>
        <Text>Create Notion</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
            <Text>Go to Homeaa</Text>
        </TouchableOpacity>
        </View>
    )
}