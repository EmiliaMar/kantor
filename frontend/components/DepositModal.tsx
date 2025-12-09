import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { deposit } from "../services/walletService";
import GlassCard from "./GlassCard";
import { theme } from "../constants/theme";

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DepositModal({
  visible,
  onClose,
  onSuccess,
}: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = async () => {
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum)) {
      setError("Enter valid amount");
      return;
    }

    if (amountNum < 10 || amountNum > 50000) {
      setError("Amount must be between 10 and 50,000 PLN");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deposit(amountNum);
      setAmount("");
      onSuccess();
    } catch (err) {
      const error = err as { error?: string };
      setError(error.error || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  const setQuickAmount = (quickAmount: number) => {
    setAmount(String(quickAmount));
    setError("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <GlassCard style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={[theme.colors.success, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name="wallet-outline" size={28} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Deposit Funds</Text>
            <Text style={styles.subtitle}>Add money to your wallet</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount (PLN)</Text>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
              <Text style={styles.currency}>PLN</Text>
              <TextInput
                style={styles.currency}
                placeholder="0.00"
                placeholderTextColor={theme.colors.text.tertiary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.hint}>Min: 10 PLN • Max: 50,000 PLN</Text>
            )}
          </View>

          <View style={styles.quickAmounts}>
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickButton}
                onPress={() => setQuickAmount(quickAmount)}
              >
                <Text style={styles.quickButtonText}>{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.depositButton}
              onPress={handleDeposit}
              disabled={loading}
            >
              <LinearGradient
                colors={[theme.colors.success, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.depositButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.depositButtonText}>Deposit</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: "85%",
    maxWidth: 400,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...theme.typography.title2,
    color: theme.colors.text.primary,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    ...theme.typography.subheadline,
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.subheadline,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background + "60",
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputError: {
    borderColor: theme.colors.danger,
    borderWidth: 2,
  },
  currency: {
    ...theme.typography.title3,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  input: {
    ...theme.typography.title1,
    color: theme.colors.text.primary,
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
  },
  quickAmounts: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: theme.colors.background + "60",
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickButtonText: {
    ...theme.typography.callout,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.background + "60",
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
  },
  cancelButtonText: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
  },
  depositButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  depositButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  depositButtonText: {
    ...theme.typography.headline,
    color: "#fff",
  },
});
