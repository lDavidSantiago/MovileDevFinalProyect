/* eslint-disable react-hooks/exhaustive-deps */
import { Colors } from "@/constants/Colors";
import { useSupabase } from "@/context/SupabaseContext";
import { Task, TaskList } from "@/types/enums";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { DefaultTheme } from "@react-navigation/native";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import React, { useCallback, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  DragEndParams,
} from "react-native-draggable-flatlist";
import { TextInput } from "react-native-gesture-handler";
import ListItem from "./ListItem";
import { useAuth } from "@clerk/clerk-expo";


export interface ViewListProps {
  taskList: TaskList;
  onDelete?: () => void;
}

const ViewList = ({ taskList, onDelete }: ViewListProps) => {
  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.5}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetRef.current?.close()}
      />
    ),
    []
  );
  const {
    deleteBoardList,
    updateBoardList,
    getListCards,
    addListCard,
    updateCard,
    getRealtimeCardSubscription,
  } = useSupabase();
  const [listName, setListName] = useState(taskList.title);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const [isAdding, setIsAdding] = useState(Boolean);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const {userId} = useAuth();
  const { uploadFile } = useSupabase();
  useEffect(() => {
    loadListTasks();
    const subscription = getRealtimeCardSubscription!(
      taskList.id,
      handleRealtimeChanges
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const handleRealtimeChanges = (
    update: RealtimePostgresChangesPayload<any>
  ) => {
    const record = update.new?.id ? update.new : update.old;
    const events = update.eventType;
    if (!record) return;
    if (events === "INSERT") {
      setTasks((prev) => [...prev, record]);
    } else if (events === "UPDATE") {
      setTasks((prev) => {
        return prev
          .map((task) => {
            if (task.id === record.id) {
              return record;
            }
            return task;
          })
          .filter((task) => !task.done)
          .sort((a, b) => a.position - b.position);
      });
    } else if (events === "DELETE") {
      setTasks((prev) => prev.filter((item) => item.id !== record.id));
    } else {
      console.log("Unhandled event type:", events);
    }
  };

  const onAddCard = async () => {
    const { data } = await addListCard!(
      taskList.id,
      taskList.board_id,
      newTask,
      tasks.length
    );
    console.log("New Task Added:", data);
    setIsAdding(false);
    setNewTask("");
    // setTasks([...tasks, data]);
  };
  const snapPoints = React.useMemo(() => ["40%"], []);

  const loadListTasks = async () => {
    const tasks = await getListCards!(taskList.id);
    setTasks(tasks);
  };
  const onUpdateTaskList = async () => {
    await updateBoardList!(taskList, listName);
  };
  const onDeleteTaskList = async () => {
    await deleteBoardList!(taskList.id);
    bottomSheetRef.current?.close();
    onDelete?.();
  };
  const onTaskDropped = async (params: DragEndParams<Task>) => {
    const newData = params.data.map((item, index) => {
      return { ...item, position: index };
    });
    setTasks(newData);

    newData.forEach(async (item) => {
      await updateCard!(item);
    });
  };

  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  const onSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: "base64" });
      const fileName = `${new Date().getTime()}-${userId}.${img.type === 'image' ? 'png' : 'mp4'}`;
      const filePath = `${taskList.board_id}/${fileName}`;
      const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
      const storagePath = await uploadFile!(filePath, base64, contentType);
      console.log('Fuap ~ onSelectImage ~ storagePath:', storagePath);

      if (storagePath){
        addListCard!(taskList.id, taskList.board_id, fileName, tasks.length, storagePath)
      }
    }
  };

  return (
    <BottomSheetModalProvider>
      <View style={{ paddingTop: 20, paddingHorizontal: 30 }}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.listTitle}>{listName}</Text>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.present()}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <DraggableFlatList
            data={tasks}
            renderItem={ListItem}
            keyExtractor={(item) => `${item.id}`}
            contentContainerStyle={{ gap: 6 }}
            containerStyle={{
              paddingBottom: 4,
              maxHeight: "80%",
            }}
            onDragEnd={onTaskDropped}
            onDragBegin={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
            onPlaceholderIndexChange={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          />

          {isAdding && (
            <TextInput
              autoFocus
              style={styles.input}
              onChangeText={setNewTask}
            />
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 8,
              marginVertical: 8,
            }}
          >
            {!isAdding && (
              <>
                <TouchableOpacity
                  onPress={() => setIsAdding(true)}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Ionicons name="add" size={14} />
                  <Text style={{ fontSize: 13 }}>Add card</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {onSelectImage}> 
                  <Ionicons name="image-outline" size={18} />
                </TouchableOpacity>
              </>
            )}
            {isAdding && (
              <>
                <TouchableOpacity onPress={() => setIsAdding(false)}>
                  <Text style={{ fontSize: 14, color: Colors.blue }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onAddCard}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.blue,
                      fontWeight: "bold",
                    }}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
      <BottomSheetModal
        enablePanDownToClose
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackDrop}
        handleStyle={{
          backgroundColor: DefaultTheme.colors.background,
          borderRadius: 12,
        }}
      >
        <View style={styles.container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              title="Cancel"
              onPress={() => bottomSheetRef.current?.close()}
            />
          </View>
          <View
            style={{
              backgroundColor: "white",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text>list name</Text>
            <TextInput
              style={{
                fontSize: 16,
                color: Colors.fontDark,
              }}
              value={listName}
              onChangeText={setListName}
              returnKeyType="done"
              enterKeyHint="done"
              onEndEditing={onUpdateTaskList}
            />
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDeleteTaskList}
          >
            <Text>Delete List</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
  container: {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
    gap: 16,
  },
  deleteButton: {
    backgroundColor: "white",
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  input: {
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.2,
    borderRadius: 4,
  },
});
