import { View, Text, TouchableOpacity,TextInput, Image } from 'react-native'
import React from 'react'
import { styles } from "../../styles/tabs.styles";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import ThemeButton from '@/components/themeButton';
import { useTheme } from '@/providers/themeContext';

import ThemeToggleButton from '@/components/themeButton';



export default function Profile() {
  const {signOut} = useAuth();  
  const {user} = useUser();
  const [name, setName] = useState("");
  const userName = user?.fullName || "User";
  const userProfileImage = user?.imageUrl || require("../../assets/images/profile.png");
  const {darkMode} = useTheme();
  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#2E2E2E" : "#fff" },
      ]}
      >

      <TouchableOpacity onPress={() => console.log("📷 Change Profile Image")}>
        <Image source={{uri:userProfileImage}} style={styles.profileImage} /> 
        </TouchableOpacity>
        
        <Text style={styles.userName}>{userName}</Text>

      <TouchableOpacity onPress={() => signOut()}>
        <Text style={styles.buttonText}>
        SignOut 
        </Text>
      </TouchableOpacity> 
      {/*Boton de cambiar de color */}
      <ThemeButton/>
  
    <View>
    </View>
    </View> 
  )
}