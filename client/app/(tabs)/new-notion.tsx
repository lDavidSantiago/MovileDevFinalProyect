/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotionFile } from "@/components/draggable/DraggableNotionList";
import { ThemedText } from "@/components/ThemedText";
import { useIsFocused } from "@react-navigation/native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabaseClient";
import {
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import NotionButton from "@/components/navigation/NotionButton";
import { useAuth } from "@clerk/clerk-expo";
import { create } from "react-test-renderer";
const defaultIcons = [
  "🚀",
  "👻",
  "🎨",
  "🎤",
  "🥁",
  "🎲",
  "📱",
  "🌟",
  "🔥",
  "💡",
  "🚗",
  "🌈",
  "📚",
  "💻",
  "🎧",
  "🏆",
  "⚽",
  "🍔",
  "🎂",
  "🎵",
  "✈️",
  "🎮",
  "🌍",
  "🍕",
  "📷",
  "📅",
  "🔍",
  "🔧",
  "📝",
  "🛠️",
  "💼",
  "📞",
  "📈",
  "🏠",
  "🎉",
];
const randomIcon = () =>
  defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
export default function NewNotionScreen() {
  const theme = useColorScheme();
  const { userId, isSignedIn } = useAuth();

  const routeParams = useLocalSearchParams<{
    parentId?: string;
    viewingFile?: string;
  }>();
  const router = useRouter();
  const viewingFile: NotionFile = routeParams.viewingFile
    ? JSON.parse(routeParams.viewingFile)
    : null;
  const [parentFile, setParentFile] = useState<NotionFile | null>(null);

  useEffect(() => {
    const fetchParentFile = async () => {
      if (viewingFile?.id) {
        const { data, error } = await supabase
          .from("notionfile")
          .select("*")
          .eq("id", viewingFile.id)
          .single(); // Use single() to get a single object

        if (error) {
          console.error("Error fetching parent file:", error);
        } else {
          setParentFile(data);
        }
      } else {
        setParentFile(null); // Set parentFile to null if no viewingFile
      }
    };

    fetchParentFile();
  }, [viewingFile?.id]);

  const titleRef = useRef<TextInput>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [icon, setIcon] = useState(randomIcon());
  const backgroundColor = Colors[theme!].background as string;
  const textColor = Colors[theme!].text as string;
  const hasInitialized = useRef(false); // Declare hasInitialized using useRef

  function handleSaveNotionFile() {
    if (!title) return;
    const data = {
      creator: userId,
      title: title,
      icon: icon ?? randomIcon(),
      parentfileid: routeParams.parentId
        ? Number(routeParams.parentId)
        : viewingFile
        ? viewingFile.parentfileid
        : null,
      created_at: new Date().toISOString(),
      last_edit: new Date().toISOString(),
      text: "",
      order: 0,
    };

    try {
      if (viewingFile) {
        console.log("Updating file:", viewingFile.id);
        supabase
          .from("notionfile")
          .update({
            title: title,
            icon: icon,
            text: text,
            updated_at: new Date().toISOString(),
          })
          .eq("id", viewingFile.id)
          .then(() => {
            router.setParams({ parentId: "", viewingFile: "" });
            if (router.canDismiss()) {
              router.dismissAll();
            }
            router.replace("/(tabs)");
          });
      } else {
        console.log("Inserting new file:", data);
        supabase
          .from("notionfile")
          .insert([data])
          .then((response) => {
            if (response.error) {
              console.error("Supabase insert error:", response.error);
            } else {
              console.log("Data inserted successfully:", response.data);
              router.setParams({ parentId: "", viewingFile: "" });
              if (router.canDismiss()) {
                router.dismissAll();
              }
              router.replace("/(tabs)");
            }
          });
      }

      setTitle("");
      setText("");
      setIcon(randomIcon());
      router.setParams({ parentId: "", viewingFile: "" });
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            title ? (
              <NotionButton
                onPress={handleSaveNotionFile}
                title=""
                iconName="save"
                containerStyle={{
                  backgroundColor: Colors[theme!].backgroundSecondary,
                  paddingRight: 20,
                  borderRadius: 6,
                }}
              />
            ) : (
              <NotionButton
                onPress={() => {
                  router.setParams({ parentId: "", viewingFile: "" });
                  if (router.canDismiss()) {
                    router.dismissAll();
                  }
                  router.replace("/(tabs)");
                }}
                title=""
                iconName="close"
                containerStyle={{
                  backgroundColor: Colors[theme!].backgroundSecondary,
                  paddingRight: 20,
                  borderRadius: 6,
                }}
              />
            ),
        }}
      />
        <ThemedView style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="always">
            <ThemedView style={styles.container}></ThemedView>
            {icon && (
              <Text style={{ fontSize: 60, marginBottom: 6, paddingLeft: 15 }}>
                {icon}
              </Text>
            )}
            <TextInput
              ref={titleRef}
              placeholder="Untitled"
              value={title}
              onChangeText={setTitle}
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: textColor,
                padding: 10,
              }}
            />
            <TextInput
              placeholder="Type here..."
              value={text}
              onChangeText={setText}
              multiline
              style={{
                fontSize: 18,
                color: textColor,
                padding: 10,
                backgroundColor: backgroundColor,
                borderRadius: 8,
                marginBottom: 10,
                paddingLeft: 15,
              }}
            />
          </ScrollView>
        </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
