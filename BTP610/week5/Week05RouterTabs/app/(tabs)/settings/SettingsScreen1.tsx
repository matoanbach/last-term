import { Button, Text, View } from "react-native";
import appStyle from "@/styles/AppStyle";
import { useRouter } from "expo-router";

type Course = {
  code: string,
  grade: number
}

type Student = {
  id: number,
  name: string,
  courses: Course[]
}

export default function SettingsScreen1() {

  const router = useRouter();

  const goToScreen2 = () => {
    //router.navigate("/settings/SettingsScreen2");

    // Passing data to Screen2
    // router.navigate({
    //   pathname: '/settings/SettingsScreen2',
    //   params: { name: 'Chintan', location: 'Toronto, ON' }
    // });

    const student1: Student = {
      id: 1,
      name: "Johney",
      courses: [{ code: "BTP610", grade: 90 }, { code: "MAP524", grade: 75 }]
    }

    // Convert the student to a string (serialization)
    router.navigate({
      pathname: '/settings/SettingsScreen2',
      params: { student: JSON.stringify(student1) }
    })
  }

  return (
      <View style={appStyle.mainView}>
        <Text style={appStyle.title}>SettingsScreen1</Text>

        <Button title="Go To Screen2" onPress={goToScreen2} />
      </View>
  );
}
