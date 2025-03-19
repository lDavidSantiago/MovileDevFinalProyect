import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '@/styles/auth.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { Image } from "react-native";
import { useRouter } from 'expo-router'
import { useSSO } from '@clerk/clerk-expo'
import { Try } from 'expo-router/build/views/Try'

export default function login() {
  const {startSSOFlow} = useSSO(); //Single Sign On
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      const {createdSessionId,setActive} = await startSSOFlow({strategy:"oauth_google"});
      if(setActive && createdSessionId){
        setActive({session:createdSessionId})
        //Al iniciar sesion el usuario es enviado a /home
        router.replace("/(tabs)/home")
      }
    } catch(error){
      console.log("OAuth error",error)
    }

  };
  return (
    <View style={styles.container}>
      {/*Brand Section*/}
      <View style={styles.brandSection}> 
        <View style={styles.logoContainer}> 
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>Habitify</Text>
        <Text style={styles.tagline}>don't miss anything</Text>
      </View>

      {/*Ilustration*/}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/auth-bg-1.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/*Login Section*/}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={.8}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <Text>By continuing, you agree to our Terms and Privacy Policy</Text>
      </View>

    </View>
  )
}