import { ThemedText } from "@/components/ThemedText";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { ClerkAPIError } from "@clerk/types";
import React from "react";
import { Text } from "react-native";
export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAdress] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isSignedIn, setIsSignedIn] = React.useState<boolean>(false);
  const [error, setError] = React.useState<ClerkAPIError[]>([]);
  const [code, setCode] = React.useState<string>("");
  const [isLoading] = React.useState<boolean>(false);
  const [pendingVerification, setPendingVerification] =
    React.useState<boolean>(false);

  const onSignUpPress = async () => {
    //TODO : handle sign in
    if (!isLoaded) return;
    setIsSignedIn(true);
    setError([]);
    try {
      //Start Authentication
      await signUp.create({
        emailAddress,
        password,
      });
      //Validaring email email_code or link (In this case email code)
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (e) {
      console.log(e);
    } finally {
      //Finish Authentication
      setIsSignedIn(false);
    }
  };
  const onVerifyPress = async () => {
    //TODO : handle verify
    if (!isLoaded) return;
    setIsSignedIn(true);
    setError([]);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(index)");
      } else {
        console.log("Verification failed", signUpAttempt.status);
      }
    } catch (e) {
      if (isClerkAPIResponseError(e)) setError(e.errors);
      console.error(JSON.stringify(e, null, 2));
    }
  };
  if (pendingVerification) {
    return (
      <BodyScrollView
        contentContainerStyle={{ paddingHorizontal: 16, padding: 24 }}
      >
        <TextInput
          value={code}
          placeholder="Enter verification code"
          label={`Enter the verification code we sent to ${emailAddress}`}
          keyboardType="numeric"
          onChangeText={(code) => setCode(code)}
        />
        <Button
          onPress={onVerifyPress}
          disabled={!code || isSignedIn}
          loading={isSignedIn}
        >
          Verify
        </Button>
        {error.map((error) => (
          <ThemedText key={error.longMessage} style={{ color: "red" }}>
            {error.longMessage}
          </ThemedText>
        ))}
      </BodyScrollView>
    );
  }
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
      <Button
        style={{ marginTop: 16 }}
        onPress={onSignUpPress}
        loading={isLoading}
        disabled={!emailAddress || !password || isSignedIn}
      >
        Sign In
      </Button>
      <TouchableOpacity onPress={() => router.replace("/(index)")}>
        <Text style={{ color: "white" }}>Test</Text>
      </TouchableOpacity>
      {error.map((error) => (
        <ThemedText key={error.longMessage} style={{ color: "red" }}>
          {error.longMessage}
        </ThemedText>
      ))}
    </BodyScrollView>
  );
}
