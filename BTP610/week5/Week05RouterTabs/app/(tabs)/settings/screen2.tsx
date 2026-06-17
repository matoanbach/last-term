import { Button, Text, View } from "react-native";
import appStyle from "@/styles/AppStyle";
import React from "react";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter()
  const goBack = () => {
    if (router.canDismiss()) {
      router.dismiss() 
    }
  }
      const goToScreen3 = () => {
           router.navigate({pathname: "/(tabs)/settings/screen3"}) 
    }
  return (
      <View style={appStyle.mainView}>
        <Text style={appStyle.title}>Screen 2</Text>
        <Button title="Dismiss" onPress={goBack}/> 
                    <Button title="Go to screen 3" onPress={goToScreen3}/>
      </View>
  );
}
