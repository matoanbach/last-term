import { styles } from "@/CustomStyle";
import { firebaseAuth, fireDB } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const router = useRouter();
  const [userObject, setUserObject] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    error: "",
  });

  const onSignUp = async () => {
    if (
      userObject.email === "" ||
      userObject.password === "" ||
      userObject.confirmPassword === "" ||
      userObject.fullname === ""
    ) {
      setUserObject({ ...userObject, error: "Please provide all the fields!" });
      return;
    }

    if (userObject.password !== userObject.confirmPassword) {
      setUserObject({ ...userObject, error: "Password and Confirm Password must match!" });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        userObject.email,
        userObject.password
      );

      const newUser = {
        name: userObject.fullname,
        email: userObject.email,
      };

      await setDoc(doc(fireDB, "userProfile", userCredential.user.uid), newUser);

      Alert.alert("Profile created successfully", "You can now post community events.", [
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
        value={userObject.fullname}
        onChangeText={(text) => setUserObject({ ...userObject, fullname: text, error: "" })}
        placeholder="Enter full name"
        autoCapitalize="words"
      />

      <TextInput
        style={styles.inputStyle}
        value={userObject.email}
        onChangeText={(text) => setUserObject({ ...userObject, email: text, error: "" })}
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
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

      <TextInput
        style={styles.inputStyle}
        value={userObject.confirmPassword}
        onChangeText={(text) =>
          setUserObject({ ...userObject, confirmPassword: text, error: "" })
        }
        secureTextEntry
        maxLength={15}
        placeholder="Confirm password"
        autoCorrect={false}
        autoCapitalize="none"
      />

      {!!userObject.error && <Text style={styles.textError}>{userObject.error}</Text>}

      <TouchableOpacity style={styles.buttonStyle} onPress={onSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
