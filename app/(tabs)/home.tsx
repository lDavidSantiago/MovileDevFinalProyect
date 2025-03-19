import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "../../styles/auth.styles";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
export default function Index() {
  const {signOut} = useAuth();  
  const {user} = useUser();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={{color:"black"}}>
          SingOut 
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {  }}>
        <Text style={{color:"black"}}>
          Test Button 
        </Text>
      </TouchableOpacity>
    </View>
  );
}

