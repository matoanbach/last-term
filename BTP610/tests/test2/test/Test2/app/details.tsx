import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { TransactionContext } from "@/context/TransactionContext";

export default function Details() {
    const { id } = useLocalSearchParams<{id: string}>()
    const { transactions } = useContext(TransactionContext)

    const transaction = transactions.find((item) => item.id === id)

    if (!transaction) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFound}>Transaction not found.</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{transaction.name}</Text>
            <Text style={styles.detailText}>Amount: ${transaction.amount}</Text>
            <Text style={styles.detailText}>Type: {transaction.type}</Text>
            <Text style={styles.detailText}>ID: {transaction.id}</Text>
            <Text style={styles.detailText}>Location: {transaction.location}</Text>
            <Text style={styles.detailText}>Date: {transaction.date}</Text>
            <Text style={styles.detailText}>Category: {transaction.category}</Text>
            <Text style={styles.detailText}>Description: {transaction.description}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "500",
        color: "#000",
        marginBottom: 12,
    },
    detailText: {
        fontSize: 16,
        color: "#000",
        lineHeight: 22,
        marginBottom: 10,
    },
    notFound: {
        fontSize: 18,
        color: "#000",
        textAlign: "center",
        marginTop: 40,
        fontWeight: "500",
    }
})
