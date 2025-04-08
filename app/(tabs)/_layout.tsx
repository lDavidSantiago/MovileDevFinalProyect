import { Tabs } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native'
import {AntDesign, Ionicons} from "@expo/vector-icons"

export default function TabLayout() {
  return (
    <Tabs
    screenOptions = {{
      tabBarShowLabel: false,
      headerShown:false,
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        height: 55,
        paddingBottom: 10,
        
      },
    }}
      >
      <Tabs.Screen
        name='home'
        options={{
          tabBarIcon: ({size,color}) => <Ionicons name ="home" size={size} color={color}/>,
          }} />
        <Tabs.Screen
        name='search'
        options={{
          tabBarIcon: ({size,color}) => <Ionicons name ="search" size={30} color={color}/>
        }}/>
        
        
        <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({size,color}) => <AntDesign name ="profile" size={27} color={color}/>
        }}/>



    </Tabs>
  )
}