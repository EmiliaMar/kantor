import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Wallet } from "../services/walletService";

interface WalletCardProps {
  wallet: Wallet;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.currency}>{wallet.currency}</Text>
        <Text style={styles.balance}>{wallet.balance.toFixed(2)}</Text>
      </View>

      {wallet.currency !== "PLN" && (
        <Text style={styles.valuePLN}>
          ≈ {wallet.valueInPLN.toFixed(2)} PLN
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currency: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  balance: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
  },
  valuePLN: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "right",
  },
});
