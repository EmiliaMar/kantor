import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getBalance } from "../../services/walletService";
import GlassCard from "../../components/GlassCard";
import DepositModal from "../../components/DepositModal";
import { theme } from "../../constants/theme";
import { currencyFlags } from "../../constants/flags";

interface Wallet {
  currency: string;
  balance: number;
  valueInPLN?: number;
}

export default function WalletScreen() {
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await getBalance();
      setBalance(data);
    } catch (error) {
      console.error("error fetching balance:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBalance();
  };

  const handleDepositSuccess = () => {
    setShowDepositModal(false);
    fetchBalance();
  };

  const openDepositModal = () => {
    setShowDepositModal(true);
  };

  const closeDepositModal = () => {
    setShowDepositModal(false);
  };

  const filterWallets = (wallets: Wallet[]) => {
    return wallets.filter((wallet) => wallet.balance > 0);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderWalletCard = ({ item }: { item: Wallet }) => (
    <GlassCard style={styles.walletCard}>
      <View style={styles.walletRow}>
        <View style={styles.walletInfo}>
          <View style={styles.currencyCircle}>
            <Image
              source={currencyFlags[item.currency]}
              style={styles.flagImage}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={styles.walletCurrency}>{item.currency}</Text>
            {item.currency !== "PLN" && item.valueInPLN !== undefined && (
              <Text style={styles.walletValuePLN}>
                ≈ {item.valueInPLN.toFixed(2)} PLN
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.walletBalance}>{item.balance.toFixed(2)}</Text>
      </View>
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.balanceSection}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>
            {balance?.totalValuePLN.toFixed(2)} PLN
          </Text>

          <TouchableOpacity
            style={styles.depositButton}
            onPress={openDepositModal}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.depositButtonText}>Deposit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <FlatList
        data={filterWallets(balance?.wallets || [])}
        keyExtractor={(item) => item.currency}
        renderItem={renderWalletCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <DepositModal
        visible={showDepositModal}
        onClose={closeDepositModal}
        onSuccess={handleDepositSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  balanceSection: {
    padding: theme.spacing.lg,
    paddingTop: 60,
  },
  balanceCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  balanceLabel: {
    ...theme.typography.subheadline,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  balanceValue: {
    ...theme.typography.largeTitle,
    color: "#fff",
    marginBottom: theme.spacing.lg,
  },
  depositButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.full,
    alignSelf: "flex-start",
  },
  depositButtonText: {
    ...theme.typography.headline,
    color: "#fff",
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  walletCard: {
    marginBottom: theme.spacing.md,
  },
  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  flagImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  walletCurrency: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
  },
  walletValuePLN: {
    ...theme.typography.footnote,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  walletBalance: {
    ...theme.typography.title2,
    color: theme.colors.text.primary,
  },
});
