import { Text, View,StyleSheet, TouchableOpacity } from "react-native";
import {styles} from "../../styles/auth.styles";
import { Image } from "react-native";
import {Link} from "expo-router"
export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Hello Worldaaaaaaaaaa</Text> 
      <Image
        source={{ uri: 'https://i.imgur.com/1iCzwsi.png' }}
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

