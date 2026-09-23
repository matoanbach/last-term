import {useContext} from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { TransactionContext } from "@/context/TransactionContext";
import { Transaction } from "@/types/Transaction";

export default function Index() {
  const {transactions } = useContext(TransactionContext)
  const router = useRouter()

  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Transaction Manager</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.navigate("/new-transaction")}
      >
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>
      
      <FlatList 
        data={transactions}
        keyExtractor={(item: Transaction) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions yet</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator}/>}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.navigate({
              pathname: "/details", params: { id: item.id }})}
          >
            <View>
              <Text style={styles.name}>
                {item.name}
              </Text>
              <Text style={styles.type}>
                {item.type}
              </Text>
            </View>
            <Text
              style={[
                styles.amount,
                {color: item.type === "Deposit" ? "green": "red"}
              ]}
            >
              ${item.amount}
            </Text>
          </TouchableOpacity>
        )}
      >

      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  addButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 0,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  type: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#000",
    marginTop: 40,
    fontWeight: "400",
  },
  separator: {
    height: 12
  }
})
