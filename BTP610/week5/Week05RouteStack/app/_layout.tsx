import { Stack } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#ff9f43'
      },
      headerTintColor: 'white',
      headerRight: () => {
        return (
          <MaterialIcons name="settings" size={24} color="white" />
        )
      }
    }}>
      <Stack.Screen name="index" options={{
        title: "Main Screen"
      }} />
      <Stack.Screen name="screen2" options={{
        title: "Screen 2",
        headerShown: false
        // headerStyle: {
        //   backgroundColor: '#ee5253'
        // }
      }} />
      <Stack.Screen name="screen3" options={{
        title: "Screen 3",
        headerStyle: {
          backgroundColor: '#a5eedc'
        }
      }} />
      <Stack.Screen name="screen4" options={{
        title: "Screen 4",
        headerStyle: {
          backgroundColor: '#341f97'
        },
        headerRight: () => {
          return (
            <MaterialIcons name="info" size={24} color="white" onPress={() => alert("I am Screen 4.")} />
          )
        },
        headerLeft: () => {
          return (
            <MaterialIcons name="info" size={24} color="white" onPress={() => alert("I am Screen 4.")} />
          )
        },
        headerBackVisible: true
      }} />
    </Stack>
  );
}
