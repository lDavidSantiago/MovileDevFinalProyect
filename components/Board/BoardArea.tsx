import { useSupabase } from "@/context/SupabaseContext";
import { Board, TaskList, TaskListFake } from "@/types/enums";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel"; // Ensure you have installed react-native-reanimated-carousel
import { SafeAreaView } from "react-native-safe-area-context";
import ListStart from "./ListStart";

export interface BoardAreaProps {
  board?: Board;
}
const BoardArea = ({ board }: BoardAreaProps) => {
  const { width, height } = useWindowDimensions();
  const [startListActive, setStartListActive] = useState(false);
  const progress = useSharedValue(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  useEffect(() => {
    if (!board) return;
    loadBoardList();
  }, [board]);
  const loadBoardList = async () => {
    const lists = await getBoardLists!(board!.id);
    console.log("Board Lists:", lists);
    setData([...lists, { id: undefined }]);
  };
  const ref = useRef<ICarouselInstance>(null);
  const { getBoardLists, addBoardList } = useSupabase();
  const [data, setData] = useState<(TaskList | TaskListFake)[]>([
    { id: undefined },
    { id: undefined },
    { id: undefined },
  ]);
  const onSaveNewList = async (title: string) => {
    setStartListActive(false);
    const { data: newItem } = await addBoardList!(board?.id!, title);
    console.log("OnSaveNewList data:", newItem);
    data.pop();
    setData([...data, newItem, { id: undefined }]);
  };
  return (
    <View style={{ flex: 1 }}>
      {/*  Outer View */}
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        {/* Carousel only */}
        <Carousel
          data={data}
          width={width}
          height={height}
          loop={false}
          onProgressChange={progress}
          renderItem={({ index, item }: any) => (
            <View key={index}>
              {item.id ? (
                <Text>{item.title}</Text>
              ) : (
                <View style={{ paddingTop: 20, paddingHorizontal: 30 }}>
                  {startListActive ? (
                    <ListStart
                      onCancel={() => setStartListActive(false)}
                      onSave={onSaveNewList}
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.listAddButton}
                      onPress={() => setStartListActive(true)}
                    >
                      <Text style={{}}>Add list</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        />
      </SafeAreaView>
      <View style={{ marginBottom: 40 }}>
        {/* Add bottom margin */}
        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={{ backgroundColor: "#ffffff5c", borderRadius: 40 }}
          size={8}
          activeDotStyle={{ backgroundColor: "#fff" }}
          containerStyle={{ gap: 10, marginTop: 10 }}
          onPress={onPressPagination}
        />
      </View>
    </View>
  );
};

export default BoardArea;

const styles = StyleSheet.create({
  listAddButton: {
    backgroundColor: "#00000047",
    height: 44,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
