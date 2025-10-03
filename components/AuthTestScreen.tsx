import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { signUpUser, loginUser, logoutUser, listenToAuthChanges } from "../utils/authHelpers";

export default function AuthTestScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  // 🔥 Listen to auth state
  useEffect(() => {
    const unsubscribe = listenToAuthChanges((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {user ? (
        <>
          <Text>Welcome {user.email}</Text>
          <Button title="Logout" onPress={() => logoutUser()} />
        </>
      ) : (
        <>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

          <Button title="Sign Up" onPress={() => signUpUser(email, password)} />
          <Button title="Login" onPress={() => loginUser(email, password)} />
        </>
      )}
    </View>
  );
}