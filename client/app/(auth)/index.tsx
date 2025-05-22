import { ThemedText } from "@/components/ThemedText";
import { isClerkAPIResponseError, useSignIn, useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";

import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import React from "react";
import { ClerkAPIError } from "@clerk/types";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/useWarpUpBrowser";
import * as AuthSession from "expo-auth-session";
// Handle any pending authentication sessions
export default function SignInScreen() {
  WebBrowser.maybeCompleteAuthSession();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAdress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
  const { startSSOFlow } = useSSO();
  useWarmUpBrowser();

  const openLink = () => {
    WebBrowser.openBrowserAsync("https://www.google.com/?hl=es");
  };

  const onSignInPress = React.useCallback(async () => {
    //* Preload the browser for Android devices to reduce authentication load time
    console.log("Preloading browser...");
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
        router.replace("/(tabs)");
      }
      // * if the status isn't complete, log the signInAttempt object to see the status and errors
      else {
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSignedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, emailAddress, password]);

  //Handle Google Sign In
  const handleSignInWithGoogle = React.useCallback(async () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        // concatenate (auth) since clerk's dashboard requires it
        // trying to use the scheme alone doesn't work, also for production
        // add the scheme in the "Allowlist for mobile SSO redirect" section under configure > sso connections
        redirectUrl: AuthSession.makeRedirectUri({ path: "(auth)" }),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        console.log("Session ID:", createdSessionId);
        router.replace("/(tabs)");
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }, [router, startSSOFlow]);

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
        <ThemedText>Don't have an account?</ThemedText>
        <Button onPress={() => router.push("/(auth)/sign-up")} variant="ghost">
          Sign Up
        </Button>
      </View>
      <View style={{ marginTop: 16, alignItems: "center" }}>
        <ThemedText>Or continue with</ThemedText>
        <Button
          onPress={handleSignInWithGoogle}
          variant="outline"
          style={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Google icon would go here in a real implementation */}
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#4285F4",
                borderRadius: 10,
                marginRight: 8,
              }}
            />
            <ThemedText style={{ fontWeight: "500" }}>
              Sign in with Google
            </ThemedText>
          </View>
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
        <Button onPress={() => openLink()} variant="ghost">
          Contact Me
        </Button>
      </View>
    </BodyScrollView>
  );
}
