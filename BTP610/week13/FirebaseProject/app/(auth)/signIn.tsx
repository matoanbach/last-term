import { styles } from "@/CustomStyle";
import { firebaseAuth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function signIn() {
    const router=useRouter();

    //same object state pattern as signUp- simpler: only email, password, error

    const [userObject,setUserObject] =useState ({
        email:'',
        password:'',
        error:''
    });

    const onSignIn= async() => {
        //1. Validate

        if(userObject.email==="" || userObject.password==="") {
            setUserObject({...userObject,error: 'Email and Password cannot be empty!'});
            return;
        }

        try {
            //2. Sign in with Firebase Auth
            await signInWithEmailAndPassword(firebaseAuth,userObject.email,userObject.password).then ((result)=> {
                //3. On success- show alert and navigate
                Alert.alert (
                    'Sign In Successful',
                    `Welcome ${result.user.email}`,
                    [{
                        text:'Okay',
                        onPress:() =>{router.replace('/BookList')}
                    }]
                )
            })
        }
        catch (error:any) {
            console.log(error);
            setUserObject({...userObject, error: `${error.message}`})
        }
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.inputStyle}
            value={userObject.email}
            onChangeText={(text)=> setUserObject ({...userObject,email:text})}
            placeholder="Enter email" keyboardType="email-address"
            autoCorrect={false} autoCapitalize="none"/>

            <TextInput style={styles.inputStyle}
            value={userObject.password}
            onChangeText={(text)=> setUserObject ({...userObject, password:text})}
            secureTextEntry={true} maxLength={15}
            placeholder="Enter password"
            autoCorrect={false} autoCapitalize="none"/>

            { !!userObject.error &&
            <View><Text style={styles.textError}>{userObject.error}</Text></View>
}

<TouchableOpacity style={styles.buttonStyle} onPress={onSignIn}>
    <Text style={styles.buttonText}>Sign In</Text>
</TouchableOpacity>

<View style={styles.ViewSeparator}>
    <View style={styles.itemSeparator} />
    <Text style= {{marginHorizontal:15, fontSize:18}}>Don't have an account?</Text>
    <View style={styles.itemSeparator} />
</View>
<TouchableOpacity style={styles.buttonStyle}
onPress={()=>{router.navigate("/(auth)/signUp");}}>
    <Text style={styles.buttonText}>Sign Up</Text>
</TouchableOpacity>

        </View>
    )

}