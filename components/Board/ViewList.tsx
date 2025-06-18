import { TaskList } from "@/types/enums";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { DefaultTheme } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ViewListProps {
  taskList: TaskList;
}

const ViewList = ({ taskList }: ViewListProps) => {
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
  const [listName, setListName] = useState(taskList.title);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["40%"], []);
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
});
