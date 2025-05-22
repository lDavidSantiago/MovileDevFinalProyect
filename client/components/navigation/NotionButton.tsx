import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  useColorScheme,
  Text, // Import Text
} from "react-native";
import { Colors } from "@/constants/Colors";

interface NotionButtonProps {
  onPress: () => void;
  title?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
}
export default function NotionButton({
  onPress,
  iconName,
  title,
  containerStyle,
}: NotionButtonProps) {
  const theme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: Colors[theme!].backgroundSecondary,
          borderRadius: title ? 6 : 40,
        },
        containerStyle,
      ]}
    >
      {iconName && (
        <Ionicons name={iconName} size={25} color={Colors[theme!].text} />
      )}
      {title && (
        <Text // Use Text instead of ThemedText
          style={{
            fontSize: 14,
            lineHeight: 0,
            fontWeight: "600",
            color: "#ECEDEE", // Apply theme-based color
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 7,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
