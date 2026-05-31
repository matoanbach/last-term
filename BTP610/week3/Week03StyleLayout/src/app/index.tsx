import { Text, View } from "react-native";
import appStyle from "@/style/AppStyle";
import { cloneElement } from "react";

export default function Index() {
  return (
    <>
      {/* From StyleSheet */}
      <View style={appStyle.mainView}>
        {/* Inline Style */}
        <Text style={{ fontSize: 20, borderWidth: 2, padding: 5, marginTop: 20, marginBottom: 50 }}>
          Style & Layout
        </Text>

        <Text style={[appStyle.text1, appStyle.text2]}>Style from Inline and StyleSheet</Text>
      </View>

      {/* Flexbox (column) */}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center", // vertically
          alignItems: "center", // horizontally
        }}
      >
        <Text style={{ fontSize: 20, borderWidth: 2, padding: 10 }}>Apple</Text>
        <Text style={{ fontSize: 20, borderWidth: 2, padding: 10 }}>Banana</Text>
        <Text style={{ fontSize: 20, borderWidth: 2, padding: 10 }}>Cherry</Text>
      </View>

      {/* Flexbox (row) */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around", // horizontally
          alignItems: "center", // vertically
        }}
      >
        <Text style={{ fontSize: 20, borderWidth: 2, padding: 10 }}>Apple</Text>
        <Text style={{ fontSize: 20, borderWidth: 2, padding: 10 }}>Banana</Text>
        <Text style={{ fontSize: 20, borderWidth: 2, padding: 10 }}>Cherry</Text>
      </View>

      {/* Flex wrap + gap */}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
        <View style={{ backgroundColor: "slateblue", width: 96, height: 96 }} />
      </View>
    </>
  );
}
