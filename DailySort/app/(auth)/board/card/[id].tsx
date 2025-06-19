import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from "react-native";
import { useSupabase } from "@/context/SupabaseContext";
import { Task, User } from "@/types/enums"; 
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import { DefaultTheme } from "@react-navigation/native";
import { FlatList } from "react-native";
import UserListItem from "@/components/Board/UserListItem";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["60%"], []);

  console.log("Card ID:", id);

  const { getCardInfo, getBoardMember, getFileFromPath, updateCard, assignCard } = useSupabase();
  const router = useRouter();
  const [card, setCard] = useState<Task>();
  const [member, setMember] = useState<User[]>();
  const [imagePath, setImagePath] = useState<string>();
  
  if (card?.image_url){
    getFileFromPath!(card.image_url).then((path) => {
      if (path) {
        setImagePath(path);
      }
    });
  }

  useEffect(() => {
      if (!id) return;
      loadInfo();
    }, [id]);
  
  const loadInfo = async () => {
    const data = await getCardInfo!(id);
    console.log("🚀load info🚀:", data);
    setCard(data);

    const member = await getBoardMember!(data.board_id);
    console.log("🚀load info🚀:", member);
    setMember(member);
  };
  
  const saveAndClose = () => {
    updateCard!(card!)
    router.back();   
  };

  const onArchiveCard = async () => {
    updateCard!({ ...card!, done: true });
    router.back();
  };

  const onAssignUser = async (user: User) => {
    const {data} = await assignCard!(card!.id, user.id);
    console.log("Assigned User:", data);
    setCard(data);
    bottomSheetRef.current?.close();
  };

  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={() => bottomSheetRef.current?.close()}
      />
    ),
    []
  )

    return (
    <BottomSheetModalProvider>
      <View style ={{ flex: 1}}> 
      <Stack.Screen options ={{
        headerLeft: () => (
          <TouchableOpacity onPress={saveAndClose}> 
            <Ionicons name="close" size={18} color={Colors.grey} />
          </TouchableOpacity>
          ),
        }}
      />
      {card && (
        <>
        {!card.image_url && (
          <TextInput
            value = {card.title}
            onChangeText={(text: string) => setCard({ ...card, title: text })} />
        )}
        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          value={card.description || ''}
          onChangeText={(text: string) => setCard({ ...card, description: text })}
          />
          {imagePath && (
            <Image
              source={{ uri: imagePath }}
              style={{ width: 100, height: 400, borderRadius: 4, backgroundColor: "#fff" }}
            />
          )}
          <View style = { styles.memberContainer}>
            <Ionicons name="person" size = {24} color = {Colors.grey} />
            <TouchableOpacity style = {{flex: 1}}
            onPress={() => bottomSheetRef.current?.present()}>
              {!card.assigned_to ? (
                <Text>Assign...</Text>
              ) : (
                <Text>Assigned to {card.users?.first_name || card.users?.email}</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress = {onArchiveCard} style = {styles.btn}>
            <Text style = {styles.btnText}>Archive Card</Text>
          </TouchableOpacity>
        </>
      )}
      </View>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enableOverDrag={false}
        enablePanDownToClose={true}
        backdropComponent={renderBackDrop}
        handleStyle = {{backgroundColor: DefaultTheme.colors.background, borderRadius: 12}}>
          <View style = {styles.buttomContainer}>
            <View style = {{ flexDirection: "row", alignItems: "center", paddingHorizontal: 1}}>
              <Button title="cancel" onPress={() => bottomSheetRef.current?.close()} />
            </View>
            <View style = {{ backgroundColor: '#fff', padding:10}}>
              <FlatList data={member}
                contentContainerStyle={{ gap: 8, padding: 10 }}
                renderItem={(item) => <UserListItem element={item} onPress={onAssignUser} />}
              />
            </View>
          </View>
          
        </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    marginVertical: 8,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    padding: 8,
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  btn:{
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderColor: '#fff',
    borderWidth: 1,
  },
  btnText:{
    fontSize: 18,
  },
  buttomContainer: {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
    gap:16,
  },
})

export default Page;
