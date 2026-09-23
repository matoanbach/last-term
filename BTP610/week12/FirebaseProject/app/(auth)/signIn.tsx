import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View, Alert, TextInput} from "react-native";
import { styles } from "@/CustomStyle";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/firebaseConfig";


export default function signIn() {
    const router=useRouter();

    // same object state pattern as signUp - simple: only email, password, error
    const [userObject, setUserObject] = useState({
        email: "",
        password: "",
        error: ""
    })

    const onSignIn = async() => {
        // 1 - validate
        if (userObject.email === "" || userObject.password === "") {
            setUserObject({...userObject, error: "Email and Passowrd cannot be empty!"}) 
        }

        try {
            // 2 - sign in with firebase auth
            await signInWithEmailAndPassword(firebaseAuth, userObject.email, userObject.password).then((result) => {
                // 3 - on success - show alert and navigate
                Alert.alert(
                    "Sign in successfully",
                    `Welcome ${result.user.email}`,
                    [{
                        text: "Okay",
                        onPress: () => {router.replace("/BookList")}
                    }]
                )
            })
        } catch (error: any) {
            console.log(error)
            setUserObject({...userObject, error: `${error.message}`})
        }
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.inputStyle} value={userObject.email}
                onChangeText={(text) => setUserObject({...userObject, email: text})}
                placeholder="Enter email" keyboardType="email-address"
                autoCapitalize="none" autoCorrect={false}
            />

            <TextInput style={styles.inputStyle} value={userObject.password}
                onChangeText={(text) => setUserObject({...userObject, password: text})}
                placeholder="Enter password" 
                secureTextEntry={true}
                maxLength={15}
                autoCapitalize="none" autoCorrect={false}
            />
            { userObject.error && 
                <View><Text style={styles.textError}>{userObject.error}</Text></View>
            }

            <TouchableOpacity style={styles.buttonStyle} onPress={onSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.ViewSeparator}>
                <View style={styles.itemSeparator}/>
                <Text style={{marginHorizontal: 15, fontSize: 18}}>Don't have an account</Text>
                <Text style={styles.itemSeparator}/>
            </View>

            <TouchableOpacity style={styles.buttonStyle}
                onPress={() => {router.navigate("/(auth)/signUp")}}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    )
}