import { Colors } from "@/constants/Colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigationState } from "@react-navigation/native";
import { Tabs } from "expo-router";

const Layout = () => {
  const state = useNavigationState((state) => state);
  const currentRoute = state.routes[state.index];

  const hideTabBar = currentRoute?.name?.includes("boards/[id]");
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTitleStyle: {
          color: "white",
        },
        tabBarStyle: hideTabBar ? { display: "none" } : {},
      }}
    >
      <Tabs.Screen
        name="boards"
        options={{
          headerShown: false,
          title: "Boards",
          // tabBarIcon: ({ size, color, focused }) => (
          //   <Image
          //     style={{ width: size, height: size }}
          //     source={
          //       focused
          //         ? require("@/assets/images/logo-icon-blue.png")
          //         : require("@/assets/images/logo-icon-neutral.png")
          //     }
          //   />
          // ),
        }}
      />
      <Tabs.Screen
        name="my-cards"
        options={{
          title: "My Cards",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons
              name="view-dashboard-variant-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="user-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
