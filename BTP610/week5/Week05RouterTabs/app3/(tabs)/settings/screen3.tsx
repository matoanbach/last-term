import { Button, Text, View } from "react-native";
import appStyle from "@/styles/AppStyle";
import React from "react";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter()
  const goBack = () => {
    if (router.canDismiss()) {
      router.dismiss(2) 
    }
  }

  return (
      <View style={appStyle.mainView}>
        <Text style={appStyle.title}>Screen 3</Text>
        <Button title="Dismiss" onPress={goBack}/> 
      </View>
  );
}
