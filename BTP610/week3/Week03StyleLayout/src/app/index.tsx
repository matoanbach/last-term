import { Text, View } from "react-native";
import appStyle from "@/style/AppStyle";
import { cloneElement } from "react";

export default function Index() {
  return (
    // // From StyleSheet
    // <View style={appStyle.mainView}>
    //   {/* Inline Style */}
    //   <Text style={{ fontSize: 20, borderWidth: 2, padding: 5, marginTop: 20, marginBottom: 50 }}>Style & Layout</Text>

    //   <Text style={[appStyle.text1, appStyle.text2]}>Style from Inline and StyleSheet</Text>
    // </View>

    // <View style={{
    //   flex: 1,
    //   flexDirection: 'column',
    //   justifyContent: 'center', // Vertically
    //   alignItems: 'center' // Horizontally
    // }}>
    //   <Text style={{ fontSize: 20, borderWidth: 2, padding: 10, }}>Apple</Text>
    //   <Text style={{ fontSize: 20, borderWidth: 2, padding: 10, }}>Banana</Text>
    //   <Text style={{ fontSize: 20, borderWidth: 2, padding: 10, }}>Cherry</Text>
    // </View>

    // <View style={{
    //   flex: 1,
    //   flexDirection: 'row',
    //   justifyContent: 'space-around', // Horizontally
    //   alignItems: 'center' // Vertically
    // }}>
    //   <Text style={{ fontSize: 20, borderWidth: 2, padding: 10, }}>Apple</Text>
    //   <Text style={{ fontSize: 20, borderWidth: 2, padding: 10, }}>Banana</Text>
    //   <Text style={{ fontSize: 20, borderWidth: 2, padding: 10, }}>Cherry</Text>
    // </View>

    // <View style={{
    //   flex: 1,
    //   flexDirection: 'column',
    //   gap: 10,
    //   flexWrap: 'wrap'
    // }}>
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    //   <View style={{ backgroundColor: 'slateblue', width: 96, height: 96 }} />
    // </View>

    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <View style={{
        width: '100%',
        backgroundColor: 'crimson',
        flex: 25
      }} >
        <Text style={{
          fontSize: 20,
          color: '#FFF',
          textAlign: 'center'
        }}>Height: {(25/82)*100} </Text>
      </View>
      <View style={{
        width: '100%',
        backgroundColor: 'forestgreen',
        flex: 5
      }} >
        <Text style={{
          fontSize: 20,
          color: '#FFF',
          textAlign: 'center'
        }}>Height: {(5/82)*100} </Text>
      </View>
      <View style={{
        width: '100%',
        backgroundColor: 'mediumblue',
        flex: 45
      }} >
        <Text style={{
          fontSize: 20,
          color: '#FFF',
          textAlign: 'center'
        }}>Height: {(45/82)*100} </Text>
      </View>
      <View style={{
        width: '100%',
        backgroundColor: 'hotpink',
        flex: 7
      }} >
        <Text style={{
          fontSize: 20,
          color: '#FFF',
          textAlign: 'center'
        }}>Height: {(7/82)*100} </Text>
      </View>
    </View>
  );
}