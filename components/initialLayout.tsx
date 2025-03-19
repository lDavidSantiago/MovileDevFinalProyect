import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function InitialLayout() {
    const {isLoaded,isSignedIn} = useAuth()
    const segments = useSegments();
    const router = useRouter();
    
    useEffect(() => {
        if (!isLoaded) return

        const inAuthScreen = segments[0] === "(auth)"
        //If nor signed in and not in log in page redirect to login page
        if (!isSignedIn && !inAuthScreen) router.replace("../(auth)/login")
        //If signed in and in login page redirect to home page
        else if (isSignedIn && inAuthScreen) router.replace("../(tabs)/home")
    },[isLoaded,isSignedIn,segments])

    if(!isLoaded) return null

    return <Stack screenOptions={{headerShown:false}}/>
    
}