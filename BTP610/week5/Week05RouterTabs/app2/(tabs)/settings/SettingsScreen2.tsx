import { Button, Text, View } from "react-native";
import appStyle from "@/styles/AppStyle";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

type Course = {
  code: string,
  grade: number
}

type Student = {
  id: number,
  name: string,
  courses: Course[]
}

export default function SettingsScreen2() {

  const router = useRouter();

  //const { name, location } = useLocalSearchParams();

  const { student } = useLocalSearchParams();
  const newStudent: Student = JSON.parse(student as string) as Student
  const goToScreen1 = () => {
    router.navigate({
      pathname: "/settings/SettingsScreen1"
    })
  }
  return (
    <View style={appStyle.mainView}>
      <Text style={appStyle.title}>SettingsScreen2</Text>
      {/* <Text style={{ fontSize: 18 }}>Hello, my name is {name}. I am from {location}.</Text> */}
      <Text>Hello {newStudent.name}</Text>
      {
        newStudent.courses.map((currentItem: Course) => {
          return <Text key={currentItem.code}>{currentItem.code} - {currentItem.grade}</Text>
        })
      }
      <Button title="Go to screen 1" onPress={() => goToScreen1()}/>
    </View>
  );
}
