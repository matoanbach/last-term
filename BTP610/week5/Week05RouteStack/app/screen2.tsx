import { Text, TouchableOpacity, View } from "react-native";
import appStyle from "@/style/AppStyle";
import { useRouter } from "expo-router";

export default function Screen2() {

  const router = useRouter();

  const goToScreen3 = () => {
    router.navigate("/screen3");
  }

  const goBack = () => {
    router.back();
  }

  return (
    <View style={appStyle.mainView}>
      <TouchableOpacity 
        style={[appStyle.buttonStyle, { backgroundColor: '#10ac84'}]}
        onPress={goToScreen3} >
        <Text style={appStyle.buttonText}>Go to Screen 3</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={appStyle.buttonStyle}
        onPress={goBack} >
        <Text style={appStyle.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
