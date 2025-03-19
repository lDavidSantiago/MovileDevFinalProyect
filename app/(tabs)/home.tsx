import { Text, View,StyleSheet, TouchableOpacity } from "react-native";
import {styles} from "../../styles/auth.styles";
import { Image } from "react-native";
import { withLayoutContext } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
export default function Index() {
  const {signOut} = useAuth();  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={{color:"white"}}>
          SingOut 
        </Text>
      </TouchableOpacity>
    </View>
  );
}

