import { Text, Button, View } from "react-native";
import appStyle from "@/styles/AppStyle";
import React from "react";
import { useRouter } from "expo-router";

export default function Index() {

    const router = useRouter()

    const goToScreen2 = () => {
           router.navigate({pathname: "/(tabs)/settings/screen2"}) 
    }

    return (
        <View style={appStyle.mainView}>
            <Text style={appStyle.title}>Screen 1</Text>
            <Button title="Go to screen 2" onPress={goToScreen2}/>
        </View>
    );
}
