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

  const isFocused = useIsFocused();
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
  const [title, setTitle] = useState(viewingFile ? viewingFile.title : "");
  const [text, setText] = useState(viewingFile ? viewingFile.text : "");
  const [icon, setIcon] = useState(
    viewingFile ? viewingFile.icon : randomIcon()
  );
  const backgroundColor = Colors[theme!].background as string;
  const textColor = Colors[theme!].text as string;
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [theme]);

  function handleSaveNotionFile() {
    //TODO
  }
  useEffect(() => {
    if (isFocused) {
      // When the screen is focused, initialize the state
      if (viewingFile) {
        setTitle(viewingFile.title);
        setText(viewingFile.text);
        setIcon(viewingFile.icon);
      } else {
        setTitle("");
        setText("");
        setIcon(randomIcon());
      }
      if (titleRef.current) {
        titleRef.current.focus();
      }
    } else {
      // When the screen is not focused, reset the state
      setTitle("");
      setText("");
      setIcon(randomIcon());
      setParentFile(null);
    }
  }, [isFocused, viewingFile]);
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
            ) : null,
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
