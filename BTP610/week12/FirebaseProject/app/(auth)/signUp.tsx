import { View, Text, TextInput, TouchableOpacity, Alert} from "react-native"
import { styles } from "@/CustomStyle"
import { useState } from "react"
import { useRouter } from "expo-router"
import { createUserWithEmailAndPassword, EmailAuthCredential } from "firebase/auth"
import { firebaseAuth, fireDB } from "@/firebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import React from "react"

export default function signUp() {
    const router = useRouter()

    // object state - one useState holds all from fields and error

    const [userObject, setUserObject] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        fullname: "",
        contact: "",
        location: "",
        error: ""
    })

    const onSignUp = async() => {
        // 1 - validate
        if (userObject.email === "" || userObject.password === "") {
            setUserObject({...userObject, error: "Email and Password cannot be empty"}) 
            return
        }

        try {
            // 2 - create firebase auth account
            const userCredential = await createUserWithEmailAndPassword(
                firebaseAuth, userObject.email, userObject.password
            ) 

            // 3 - build profile object to save 
            const newUser = {
                name: userObject.fullname,
                email: userObject.email,
                contact: userObject.contact,
                location: userObject.location
            }

            // 4 - save to firestore - document id = firebase auth uid
            await setDoc(doc(fireDB, 'userProfile', userCredential.user.uid), newUser)

            // 5 - show success and navigate
            Alert.alert("Profile created successfully",
                "Lets explore good books to get you started...",
                [{text: "Okay",  onPress:() => (router.replace("/BookList"))}]
            )
        } catch (error: any) {
            setUserObject({...userObject, error: `${error.message}`}) 
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

                <TextInput style={styles.inputStyle} value={userObject.confirmPassword}
                    onChangeText={(text) => setUserObject({...userObject, confirmPassword: text})}
                    placeholder="confirm Password" 
                    secureTextEntry={true}
                    maxLength={15}
                    autoCapitalize="none" autoCorrect={false}
                />

                <TextInput style={styles.inputStyle} value={userObject.fullname}
                    onChangeText={(text) => setUserObject({...userObject, fullname: text})}
                    placeholder="Enter Fullname" 
                    autoCapitalize="words" 
                />

                <TextInput style={styles.inputStyle} value={userObject.contact}
                    onChangeText={(text) => setUserObject({...userObject, contact: text})}
                    placeholder="Enter contact" 
                    keyboardType="phone-pad" 
                />

                <TextInput style={styles.inputStyle} value={userObject.location}
                    onChangeText={(text) => setUserObject({...userObject, location: text})}
                    placeholder="Enter location" 
                    autoCapitalize="words"
                />

                {!userObject.error && 
                    <View>
                        <Text style={styles.textError}>{userObject.error}</Text>
                    </View>
                }

                <TouchableOpacity style={styles.buttonStyle} onPress={onSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        )
    }
}