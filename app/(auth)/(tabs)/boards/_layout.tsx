import React from "react";
import { Stack } from "expo-router";
import { Background } from "@react-navigation/elements";
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "DailySort",
        }}
        //TODO: ADD CUSTOM HEADER
      />
    </Stack>
  );
};

export default Layout;
