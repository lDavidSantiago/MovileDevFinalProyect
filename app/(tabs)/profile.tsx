import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from "../../styles/auth.styles";
import { useAuth, useUser } from "@clerk/clerk-expo";


export default function profile() {
  const {signOut} = useAuth();  
  const {user} = useUser();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={{color:"black"}}>
          SingOut 
        </Text>
      </TouchableOpacity> 
  
    <View>
      <Text>Profile test</Text>
    </View>
    </View> 
  )
}