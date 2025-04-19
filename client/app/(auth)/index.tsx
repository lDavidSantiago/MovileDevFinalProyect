import { ThemedText } from "@/components/ThemedText";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import React from "react";
import { ClerkAPIError } from "@clerk/types";
export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAdress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;
    // * Start the procces of sign in

    setIsSignedIn(true);

    // * Start the sign in process using email and pasword provided by user
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // * if User process is complete, set the session and redirect to home page
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(index)");
      }
      // * if the statusisn't complete, log the signInAttempt object to see the status and errors
      else {
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSignedIn(false);
    }
  }, [isLoaded, emailAddress, password]);
  return (
    <BodyScrollView
      contentContainerStyle={{ paddingHorizontal: 16, padding: 24 }}
    >
      <TextInput
        label="Email"
        value={emailAddress}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmailAdress}
      />
      <TextInput
        value={password}
        label="Password"
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      {errors.map((error) => (
        <ThemedText key={error.longMessage} style={{ color: "red" }}>
          {error.longMessage}
        </ThemedText>
      ))}
      <Button
        style={{ marginTop: 16 }}
        onPress={onSignInPress}
        loading={isSignedIn}
        disabled={!emailAddress || !password || isSignedIn}
      >
        Sign In
      </Button>
      <View style={{ marginTop: 16, alignItems: "center" }}>
        <ThemedText>Don't have a account?</ThemedText>
        <Button onPress={() => router.push("/(auth)/sign-up")} variant="ghost">
          Sign Up
        </Button>
      </View>
      <View style={{ marginTop: 16, alignItems: "center" }}>
        <ThemedText>Forgot Password?</ThemedText>
        <Button
          onPress={() => router.push("/(auth)/reset-password")}
          variant="ghost"
        >
          Reset Password
        </Button>
      </View>
    </BodyScrollView>
  );
}
