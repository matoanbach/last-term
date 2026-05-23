import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function HookExample() {

  const [count, setCount] = useState<number>(0);
  const [calculation, setCalculation] = useState<number>(0);

  // This runs on every render
  // useEffect(() => {
  //   console.log("useEffect 1");
  //   let timer = setTimeout(() => {
  //     setCount(count + 1)
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // });

  // This only runs on the first render
  // useEffect(() => {
  //   console.log("useEffect 2");
  //   let timer = setTimeout(() => {
  //     setCount(count + 1)
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  // This runs on the first render and everytime the value of the count updates
  useEffect(() => {
    console.log("useEffect 3");
    setCalculation(() => count * 2)
  }, [count]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24 }}>Count: {count}</Text>
      <Text style={{ fontSize: 24 }}>Calculation: {calculation}</Text>
      <Button title="Update Count" onPress={() => setCount(count + 1)} />
    </View>
  );
}
