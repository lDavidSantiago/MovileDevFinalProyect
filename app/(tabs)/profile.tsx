import { View, Text, TouchableOpacity,TextInput, Image } from 'react-native'
import React from 'react'
import { styles } from "../../styles/tabs.styles";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState } from "react";



export default function Profile() {
  const {signOut} = useAuth();  
  const {user} = useUser();
  const [name, setName] = useState("");
  const userName = user?.fullName || "User";
  const userProfileImage = user?.imageUrl ;
  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => console.log("📷 Change Profile Image")}>
        <Image source={{uri:userProfileImage}} style={styles.profileImage} /> 
        </TouchableOpacity>
        
        <Text style={styles.userName}>{userName}</Text>

      <TouchableOpacity onPress={() => signOut()}>
        <Text style={styles.buttonText}>
        SignOut 
        </Text>
      </TouchableOpacity> 
  
    <View>
    </View>
    </View> 
  )
}