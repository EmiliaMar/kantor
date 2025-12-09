import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "../services/transactionService";

interface TransactionItemProps {
  transaction: Transaction;
}
export default function TransactionItem({ transaction }: TransactionItemProps) {
  const getTypeInfo = () => {
    switch (transaction.type) {
      case "DEPOSIT":
        return {
          icon: "add-circle" as const,
          color: "#27ae60",
          label: "Zasilenie",
        };
      case "BUY":
        return {
          icon: "arrow-down-circle" as const,
          color: "#3498db",
          label: "Kupno",
        };
      case "SELL":
        return {
          icon: "arrow-up-circle" as const,
          color: "#e74c3c",
          label: "Sprzedaż",
        };
      default:
        return {
          icon: "help-circle" as const,
          color: "#95a5a6",
          label: "Inne",
        };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDescription = () => {
    if (transaction.type === "DEPOSIT") {
      return `Zasilenie portfela`;
    } else if (transaction.type === "BUY") {
      return `${transaction.fromCurrency} → ${transaction.toCurrency}`;
    } else if (transaction.type === "SELL") {
      return `${transaction.fromCurrency} → ${transaction.toCurrency}`;
    }
    return "";
  };

  const typeInfo = getTypeInfo();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: typeInfo.color + "20" },
        ]}
      >
        <Ionicons name={typeInfo.icon} size={24} color={typeInfo.color} />
      </View>

      <View style={styles.details}>
        <Text style={styles.type}>{typeInfo.label}</Text>
        <Text style={styles.description}>{getDescription()}</Text>
        <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
      </View>

      {/* amount */}
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: typeInfo.color }]}>
          {transaction.type === "DEPOSIT" ? "+" : ""}
          {transaction.amount.toFixed(2)}
        </Text>
        <Text style={styles.currency}>{transaction.toCurrency}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
