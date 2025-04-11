import React, { useState } from 'react';
import * as Linking from 'expo-linking'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { profileStyles } from "@/styles/tabs.profile";

export default function Example() {
  const {signOut} = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut()
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }
  const {user} = useUser();
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={profileStyles.header}>
        <View style={profileStyles.headerAction}>
          <TouchableOpacity
          activeOpacity={0.2}
            onPress={() => {
              router.replace("/(tabs)/home");
            }}>
            <FeatherIcon
              color="#000"
              name="arrow-left"
              size={24} />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={1} style={profileStyles.headerTitle}>Profile</Text>
        <View style={[profileStyles.headerAction, { alignItems: 'flex-end' }]}>

        </View>
      </View>
      <ScrollView contentContainerStyle={profileStyles.content}>
        <View style={[profileStyles.section, { paddingTop: 4 }]}>
          <Text style={profileStyles.sectionTitle}>Account</Text>
          <View style={profileStyles.sectionBody}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={profileStyles.profile}>
              <Image
                alt=""
                source={{
                  uri: user?.imageUrl || 'https://placeholder.com/default-avatar.png'
                }}
                style={profileStyles.profileAvatar} />
              <View style={profileStyles.profileBody}>
                <Text style={profileStyles.profileName}>{user?.firstName}</Text>
                <Text style={profileStyles.profileHandle}>{user?.primaryEmailAddress?.emailAddress}</Text>              </View>
              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={22} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>Preferences</Text>
          <View style={profileStyles.sectionBody}>
            <View style={[profileStyles.rowWrapper, profileStyles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={profileStyles.row}>
                <Text style={profileStyles.rowLabel}>Language</Text>
                <View style={profileStyles.rowSpacer} />
                <Text style={profileStyles.rowValue}>English</Text>
                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>
            <View style={profileStyles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={profileStyles.row}>
                <Text style={profileStyles.rowLabel}>Phone Number</Text>
                <View style={profileStyles.rowSpacer} />
                {/*a ? a : b */}
                <Text style={profileStyles.rowValue}>{(user?.primaryPhoneNumber?.phoneNumber)? user?.primaryPhoneNumber?.phoneNumber : "None"}</Text>
                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>
            <View style={profileStyles.rowWrapper}>
              <View style={profileStyles.row}>
                <Text style={profileStyles.rowLabel}>Notifications</Text>
                <View style={profileStyles.rowSpacer} />
                <Switch
                  //TODO: Fix this to activate or deactivate the notifications
                   />
              </View>
            </View>
            <View style={profileStyles.rowWrapper}>
              <View style={profileStyles.row}>
                <Text style={profileStyles.rowLabel}>Dark Theme</Text>
                <View style={profileStyles.rowSpacer} />
                <Switch
                 //TODO: Fix this to use the dark theme from react navigation
                  />
              </View>
            </View>
            
          </View>
        </View>
        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>Resources</Text>
          <View style={profileStyles.sectionBody}>
            <View style={[profileStyles.rowWrapper, profileStyles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://github.com/lDavidSantiago')
                }}
                style={profileStyles.row}>
                <Text style={profileStyles.rowLabel}>Contact Us</Text>
                <View style={profileStyles.rowSpacer} />
                <FeatherIcon
                  color="#76b5c5"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>
            
            
            <View style={[profileStyles.rowWrapper, profileStyles.rowLast]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={profileStyles.row}>
                <Text style={profileStyles.rowLabel}>Terms and Privacy</Text>
                <View style={profileStyles.rowSpacer} />
                <FeatherIcon
                  color="#76b5c5"
                  name="chevron-right"
                  size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={profileStyles.section}>
          <View style={profileStyles.sectionBody}>
            <View
              style={[
                profileStyles.rowWrapper,
                profileStyles.rowFirst,
                profileStyles.rowLast,
                { alignItems: 'center' },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  handleSignOut()
                }}
                style={profileStyles.row}>
                <Text style={[profileStyles.rowLabel, profileStyles.rowLabelLogout]}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={profileStyles.contentFooter}>App Version 2.24 #50491</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
