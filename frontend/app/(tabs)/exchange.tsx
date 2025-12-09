import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getCurrentRates, ExchangeRate } from "../../services/ratesService";
import {
  buyForeignCurrency,
  sellForeignCurrency,
} from "../../services/transactionService";
import { getBalance } from "../../services/walletService";
import GlassCard from "../../components/GlassCard";
import { theme } from "../../constants/theme";

type TransactionType = "BUY" | "SELL";

interface Wallet {
  currency: string;
  balance: number;
}

interface WalletBalance {
  wallets: Wallet[];
}

export default function ExchangeScreen() {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("BUY");
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [costInPLN, setCostInPLN] = useState(0);
  const [receivedPLN, setReceivedPLN] = useState(0);
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(0);

  const currencies = ["EUR", "USD", "GBP", "CHF"];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTransaction();
  }, [amount, selectedCurrency, transactionType, rates]);

  const fetchData = async () => {
    try {
      const [ratesData, walletData] = await Promise.all([
        getCurrentRates(),
        getBalance(),
      ]);
      setRates(ratesData);
      setWalletBalance(walletData);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  const calculateTransaction = () => {
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setCostInPLN(0);
      setReceivedPLN(0);
      setFee(0);
      setTotal(0);
      return;
    }

    const rate = rates.find((r) => r.currencyCode === selectedCurrency);
    if (!rate) return;

    if (transactionType === "BUY") {
      const cost = amountNum * rate.buyRate;
      const feeAmount = cost * 0.005;
      const totalCost = cost + feeAmount;

      setCostInPLN(cost);
      setFee(feeAmount);
      setTotal(totalCost);
    } else {
      const value = amountNum * rate.sellRate;
      const feeAmount = value * 0.005;
      const totalReceived = value - feeAmount;

      setReceivedPLN(value);
      setFee(feeAmount);
      setTotal(totalReceived);
    }
  };

  const handleTransaction = async () => {
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Enter valid amount");
      return;
    }

    if (total < 10) {
      setError("Minimum transaction value is 10 PLN");
      return;
    }

    if (transactionType === "BUY") {
      const plnWallet = walletBalance?.wallets.find(
        (w) => w.currency === "PLN"
      );
      if (!plnWallet || plnWallet.balance < total) {
        setError(`Insufficient funds. You need ${total.toFixed(2)} PLN`);
        return;
      }
    } else {
      const foreignWallet = walletBalance?.wallets.find(
        (w) => w.currency === selectedCurrency
      );
      if (!foreignWallet || foreignWallet.balance < amountNum) {
        setError(
          `Insufficient funds. You have ${
            foreignWallet?.balance.toFixed(2) || 0
          } ${selectedCurrency}`
        );
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      if (transactionType === "BUY") {
        await buyForeignCurrency(selectedCurrency, amountNum);
      } else {
        await sellForeignCurrency(selectedCurrency, amountNum);
      }

      await fetchData();
      setAmount("");
    } catch (err) {
      const error = err as { error?: string };
      setError(error.error || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const changeTransactionType = (type: TransactionType) => {
    setTransactionType(type);
    setError("");
  };

  const changeCurrency = (curr: string) => {
    setSelectedCurrency(curr);
    setError("");
  };

  const rate = rates.find((r) => r.currencyCode === selectedCurrency);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Exchange</Text>
          <Text style={styles.subtitle}>Buy or sell currency</Text>
        </View>

        <GlassCard style={styles.toggleCard}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                transactionType === "BUY" && styles.toggleButtonActive,
              ]}
              onPress={() => changeTransactionType("BUY")}
            >
              {transactionType === "BUY" && (
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Ionicons
                name="arrow-down-circle-outline"
                size={20}
                color={
                  transactionType === "BUY"
                    ? "#fff"
                    : theme.colors.text.secondary
                }
              />
              <Text
                style={[
                  styles.toggleText,
                  transactionType === "BUY" && styles.toggleTextActive,
                ]}
              >
                BUY
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                transactionType === "SELL" && styles.toggleButtonActive,
              ]}
              onPress={() => changeTransactionType("SELL")}
            >
              {transactionType === "SELL" && (
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Ionicons
                name="arrow-up-circle-outline"
                size={20}
                color={
                  transactionType === "SELL"
                    ? "#fff"
                    : theme.colors.text.secondary
                }
              />
              <Text
                style={[
                  styles.toggleText,
                  transactionType === "SELL" && styles.toggleTextActive,
                ]}
              >
                SELL
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <View style={styles.section}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.currencyButtons}>
            {currencies.map((curr) => (
              <TouchableOpacity
                key={curr}
                style={[
                  styles.currencyButton,
                  selectedCurrency === curr && styles.currencyButtonActive,
                ]}
                onPress={() => changeCurrency(curr)}
              >
                {selectedCurrency === curr && (
                  <View style={styles.currencyButtonGradient} />
                )}
                <Text
                  style={[
                    styles.currencyButtonText,
                    selectedCurrency === curr &&
                      styles.currencyButtonTextActive,
                  ]}
                >
                  {curr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount ({selectedCurrency})</Text>
          <GlassCard style={[styles.inputCard, error && styles.inputError]}>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.tertiary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </GlassCard>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {amount && parseFloat(amount) > 0 && rate && (
          <GlassCard style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Transaction Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {transactionType === "BUY" ? "Buy rate" : "Sell rate"}
              </Text>
              <Text style={styles.detailValue}>
                {(transactionType === "BUY"
                  ? rate.buyRate
                  : rate.sellRate
                ).toFixed(4)}{" "}
                PLN
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {transactionType === "BUY" ? "Cost" : "Value"}
              </Text>
              <Text style={styles.detailValue}>
                {(transactionType === "BUY" ? costInPLN : receivedPLN).toFixed(
                  2
                )}{" "}
                PLN
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fee (0.5%)</Text>
              <Text style={styles.detailValue}>{fee.toFixed(2)} PLN</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabelTotal}>
                {transactionType === "BUY" ? "To pay" : "You'll receive"}
              </Text>
              <Text style={styles.detailValueTotal}>
                {total.toFixed(2)} PLN
              </Text>
            </View>
          </GlassCard>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleTransaction}
          disabled={loading || !amount}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {transactionType === "BUY" ? "Buy Currency" : "Sell Currency"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {walletBalance && (
          <GlassCard style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Your Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>PLN</Text>
              <Text style={styles.balanceValue}>
                {walletBalance.wallets
                  .find((w) => w.currency === "PLN")
                  ?.balance.toFixed(2) || "0.00"}
              </Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceText}>{selectedCurrency}</Text>
              <Text style={styles.balanceValue}>
                {walletBalance.wallets
                  .find((w) => w.currency === selectedCurrency)
                  ?.balance.toFixed(2) || "0.00"}
              </Text>
            </View>
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.largeTitle,
    color: theme.colors.text.primary,
  },
  subtitle: {
    ...theme.typography.subheadline,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  toggleCard: {
    marginBottom: theme.spacing.lg,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background + "40",
    overflow: "hidden",
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: "transparent",
  },
  toggleText: {
    ...theme.typography.headline,
    color: theme.colors.text.secondary,
  },
  toggleTextActive: {
    color: "#fff",
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.subheadline,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  currencyButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  currencyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: "relative",
    overflow: "hidden",
  },
  currencyButtonActive: {
    borderColor: theme.colors.primary,
  },
  currencyButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primary + "10",
  },
  currencyButtonText: {
    ...theme.typography.headline,
    color: theme.colors.text.secondary,
  },
  currencyButtonTextActive: {
    color: theme.colors.primary,
  },
  inputCard: {
    padding: 0,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputError: {
    borderColor: theme.colors.danger,
    borderWidth: 2,
  },
  input: {
    ...theme.typography.title1,
    color: theme.colors.text.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
  },
  detailsCard: {
    marginBottom: theme.spacing.lg,
  },
  detailsTitle: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  detailLabel: {
    ...theme.typography.subheadline,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    ...theme.typography.callout,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  detailLabelTotal: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
  },
  detailValueTotal: {
    ...theme.typography.title2,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  submitButton: {
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    ...theme.typography.headline,
    color: "#fff",
  },
  balanceCard: {
    marginBottom: theme.spacing.lg,
  },
  balanceTitle: {
    ...theme.typography.subheadline,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  balanceText: {
    ...theme.typography.callout,
    color: theme.colors.text.primary,
  },
  balanceValue: {
    ...theme.typography.callout,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
});
