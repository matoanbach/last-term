import { useContext, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { TransactionContext } from "@/context/TransactionContext";
import { CategoryType, TransactionType } from "@/types/Transaction";

const categories: CategoryType[] = [
  "Utilities",
  "Transportations",
  "Groceries",
  "Shopping",
  "Entertainment",
  "Health",
  "Payroll",
];

export default function NewTransaction() {
  const router = useRouter();
  const { addTransaction } = useContext(TransactionContext);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TransactionType>("Expense");
  const [category, setCategory] = useState<CategoryType>("Utilities");

  const clearForm = () => {
    setName("");
    setAmount("");
    setLocation("");
    setDate("");
    setDescription("");
    setType("Expense");
    setCategory("Utilities");
  };

  const handleSubmit = () => {
    if (
      name.trim() === "" ||
      amount.trim() === "" ||
      location.trim() === "" ||
      date.trim() === "" ||
      description.trim() === ""
    ) {
      Alert.alert("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    if (isNaN(Number(amount))) {
      Alert.alert("Invalid Amount", "Amount must be a valid number.");
      return;
    }

    addTransaction({
      id: Date.now().toString(),
      name,
      amount: Number(amount),
      location,
      date,
      description,
      type,
      category,
    });

    clearForm();
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Transaction</Text>

      <TextInput
        style={styles.input}
        placeholder="Transaction name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            type === "Deposit" && styles.selectedDeposit,
          ]}
          onPress={() => setType("Deposit")}
        >
          <Text style={styles.optionText}>Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            type === "Expense" && styles.selectedExpense,
          ]}
          onPress={() => setType("Expense")}
        >
          <Text style={styles.optionText}>Expense</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              category === item && styles.selectedCategory,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 0,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 10,
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 0,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  selectedDeposit: {
    backgroundColor: "#eee",
  },
  selectedExpense: {
    backgroundColor: "#eee",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  selectedCategory: {
    backgroundColor: "#eee",
  },
  submitButton: {
    backgroundColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 0,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  submitButtonText: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});
