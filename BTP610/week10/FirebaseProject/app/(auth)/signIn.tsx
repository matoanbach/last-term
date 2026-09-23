import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function signIn() {
    const router=useRouter();

    return (
        <View>
            <Text>Sign In- Coming Soon</Text>
            <TouchableOpacity onPress={()=> router.navigate("/(auth)/signUp")}>
                <Text>Go to Sign Up</Text>
            </TouchableOpacity>
        </View>
    )

}