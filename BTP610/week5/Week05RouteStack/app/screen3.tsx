import { Text, TouchableOpacity, View } from "react-native";
import appStyle from "@/style/AppStyle";
import { useRouter } from "expo-router";

export default function Screen3() {

  const router = useRouter();

  const goToScreen2 = () => {
    router.navigate("/screen2");
  }

  const goToScreen4 = () => {
    router.navigate("/screen4");
  }

  const handleDismiss = () => {
    router.dismiss(1);
  }

  return (
    <View style={appStyle.mainView}>
      <TouchableOpacity 
        style={[appStyle.buttonStyle, { backgroundColor: '#ee5253'}]}
        onPress={goToScreen2} >
        <Text style={appStyle.buttonText}>Go to Screen 2</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[appStyle.buttonStyle, { backgroundColor: '#341f97'}]}
        onPress={goToScreen4} >
        <Text style={appStyle.buttonText}>Go to Screen 4</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={appStyle.buttonStyle}
        onPress={handleDismiss} >
        <Text style={appStyle.buttonText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}
