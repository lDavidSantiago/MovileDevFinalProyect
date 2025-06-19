import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Page = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
  console.log("Card ID:", id);
    return (
    <View>
      <Text>Page</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
