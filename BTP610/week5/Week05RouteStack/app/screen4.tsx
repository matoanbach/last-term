import { Text, TouchableOpacity, View } from "react-native";
import appStyle from "@/style/AppStyle";
import { useRouter } from "expo-router";

export default function Screen4() {

  const router = useRouter();

  const handleDismiss = () => {
    router.dismiss(3);
  }

  const handleDismissTo = () => {
    router.dismissTo("/screen2");
  }

  const handleDismissTop = () => {
    router.dismissAll();
  }

  return (
    <View style={appStyle.mainView}>
      <TouchableOpacity 
        style={appStyle.buttonStyle}
        onPress={handleDismiss} >
        <Text style={appStyle.buttonText}>Dismiss</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={appStyle.buttonStyle}
        onPress={handleDismissTo} >
        <Text style={appStyle.buttonText}>Dismiss To Screen2</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={appStyle.buttonStyle}
        onPress={handleDismissTop} >
        <Text style={appStyle.buttonText}>Dismiss To Top</Text>
      </TouchableOpacity>
    </View>
  );
}
