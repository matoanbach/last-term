import { Stack } from "expo-router";
import { TransactionProvider } from "../context/TransactionContext"

export default function RootLayout() {
  return (
    <TransactionProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000"
        }}
      >
        <Stack.Screen name="index" options={{title: "Transactions"}}/>
        <Stack.Screen name="details" options={{title: "Transaction Detail"}}/>
        <Stack.Screen name="new-transaction" options={{title: "New Transaction"}}/>
      </Stack>
    </TransactionProvider>
  )
}
