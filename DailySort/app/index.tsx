import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "../constants/Colors"; // Adjust the path as necessary
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ModalType } from "@/types/enums";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useAuth } from "@clerk/clerk-expo";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import AuthModal from "@/components/AuthModal";
export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();

  const showModal = async (type: ModalType) => {
    setAuthType(type);
    bottomSheetModal.current?.present();
  };

  const { showActionSheetWithOptions } = useActionSheet();

  const openlink = () => {
    WebBrowser.openBrowserAsync("https://dailysort.app/terms");
  };

  const bottomSheetModal = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["25%"], []);

  const [authType, setAuthType] = useState<ModalType | null>(null);

  const openActionSheet = async () => {
    console.log("Attempting to open ActionSheet..."); // <--- AÑADE ESTO
    const options = ["View support docs", "Contact us", "Cancel"];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: `Can't log in or sign up?`,
      },
      (selectedIndex: any) => {
        switch (selectedIndex) {
          case 0:
            break;
          case 1:
            WebBrowser.openBrowserAsync("https://github.com/lDavidSantiago");
            break;

          case cancelButtonIndex:
          // Canceled
        }
      }
    );
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      opacity={0.2} // Opacidad del fondo
      {...props}
      pressBehavior="close" // Esto permite cerrar al tocar fuera
      disappearsOnIndex={-1}
      appearsOnIndex={0}
    />
  );

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          {
            paddingTop: top + 30,
          },
        ]}
      >
        <Image source={require("../assets/logo.png")} style={styles.image} />

        <Text style={styles.loginText}>DailySort</Text>
        <Text
          style={{
            fontSize: 15,
            color: "#fff",
            paddingBottom: 10,
            paddingTop: 10,
          }}
        >
          Helps you getting all your day sorted
        </Text>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: "#fff",
              },
            ]}
            onPress={() => showModal(ModalType.Login)}
          >
            <Text style={styles.textBtn}>Log in </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: "#92E3A9",
              },
            ]}
            onPress={() => showModal(ModalType.SignUp)}
          >
            <Text
              style={[
                styles.textBtn,
                {
                  color: "black",
                },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
                
          <Text style={styles.description}>
            By signing up, you agree to our{" "}
            <Text style={styles.link} onPress={openlink}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={styles.link} onPress={openlink}>
              Privacy Policy
            </Text>
            .
          </Text>
          <Text style={styles.link} onPress={openActionSheet}>
            Cant log in or Sign up?
          </Text>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModal}
        index={0}
        snapPoints={snapPoints}
        handleComponent={() => null} // Hide the handle
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        <AuthModal authType={authType} />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Using the imported Colors object
    alignItems: "center",
  },
  image: {
    height: 450,
    paddingHorizontal: 40,
    resizeMode: "contain",
  },
  loginText: {
    fontWeight: "600",
    color: "white",
    fontSize: 24,
    padding: 1,
  },
  bottomContainer: {
    gap: 10,
    width: "100%",
    paddingHorizontal: 40,
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "white", // Using the imported Colors object
    borderWidth: 1,
  },
  textBtn: {
    fontSize: 16,
  },
  description: {
    fontSize: 12,
    color: "#fff", // Using the imported Colors object
    marginHorizontal: 60,
    textAlign: "center",
  },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
    fontSize: 12,
    textAlign: "center",
  },
});
