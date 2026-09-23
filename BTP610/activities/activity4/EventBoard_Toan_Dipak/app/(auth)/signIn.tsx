import { styles } from "@/CustomStyle";
import { firebaseAuth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const router = useRouter();
  const [userObject, setUserObject] = useState({
    email: "",
    password: "",
    error: "",
  });

  const onSignIn = async () => {
    if (userObject.email === "" || userObject.password === "") {
      setUserObject({ ...userObject, error: "Email and Password cannot be empty!" });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        userObject.email,
        userObject.password
      );

      Alert.alert("Sign In Successful", `Welcome ${result.user.email}`, [
        {
          text: "Okay",
          onPress: () => router.replace("/EventBoard"),
        },
      ]);
    } catch (error: any) {
      setUserObject({ ...userObject, error: `${error.message}` });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        value={userObject.email}
        onChangeText={(text) => setUserObject({ ...userObject, email: text, error: "" })}
        placeholder="Enter email"
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.inputStyle}
        value={userObject.password}
        onChangeText={(text) => setUserObject({ ...userObject, password: text, error: "" })}
        secureTextEntry
        maxLength={15}
        placeholder="Enter password"
        autoCorrect={false}
        autoCapitalize="none"
      />

      {!!userObject.error && <Text style={styles.textError}>{userObject.error}</Text>}

      <TouchableOpacity style={styles.buttonStyle} onPress={onSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonStyle} onPress={() => router.navigate("/(auth)/signUp")}>
        <Text style={styles.buttonText}>Go To Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
