import { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import styles from "@/assets/styles/DropMenuStyles";
export const MenuOption = ({
  onSelect,
  children,
}: {
  onSelect: () => void;
  children: ReactNode;
}) => {
  return (
    <TouchableOpacity onPress={onSelect} style={styles.menuOption}>
      {children}
    </TouchableOpacity>
  );
};
