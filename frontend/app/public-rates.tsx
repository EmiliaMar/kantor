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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getCurrentRates, ExchangeRate } from "../services/ratesService";
import GlassCard from "../components/GlassCard";
import { theme } from "../constants/theme";
import { currencyFlags } from "../constants/flags";

export default function PublicRatesScreen() {
  const router = useRouter();
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const data = await getCurrentRates();
      setRates(data);
    } catch (error) {
      console.error("error fetching rates:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRates();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderRateCard = ({ item }: { item: ExchangeRate }) => (
    <GlassCard style={styles.rateCard}>
      <View style={styles.rateRow}>
        <View style={styles.currencySection}>
          <Image
            source={{ uri: currencyFlags[item.currencyCode] }}
            style={styles.flagImage}
            resizeMode="cover"
          />
          <View style={styles.currencyText}>
            <Text style={styles.currencyCode}>{item.currencyCode}</Text>
            <Text style={styles.currencyName}>{item.currencyName}</Text>
          </View>
        </View>
        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>Buy</Text>
          <Text style={[styles.rateValue, styles.buyRate]}>
            {item.buyRate.toFixed(4)}
          </Text>
        </View>
        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>Sell</Text>
          <Text style={[styles.rateValue, styles.sellRate]}>
            {item.sellRate.toFixed(4)}
          </Text>
        </View>
      </View>
    </GlassCard>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="stats-chart-outline"
        size={64}
        color={theme.colors.text.tertiary}
      />
      <Text style={styles.emptyText}>No rates available</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        >
          <Ionicons name="swap-horizontal" size={40} color="#fff" />
        </LinearGradient>
        <Text style={styles.title}>Currency Exchange</Text>
        <Text style={styles.subtitle}>Exchange Rates</Text>
      </View>

      <FlatList
        data={rates}
        keyExtractor={(item) => item.currencyCode}
        renderItem={renderRateCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <LinearGradient
          colors={["rgba(242, 242, 247, 0)", theme.colors.background]}
          style={styles.footerGradient}
        >
          <GlassCard style={styles.ctaCard}>
            <View style={styles.ctaContent}>
              <Ionicons
                name="lock-closed"
                size={20}
                color={theme.colors.primary}
              />
              <View style={styles.ctaText}>
                <Text style={styles.ctaTitle}>
                  Sign in to exchange currency
                </Text>
                <Text style={styles.ctaSubtitle}>
                  Exchange currencies at best rates
                </Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/(auth)/login")}
              >
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push("/(auth)/register")}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.registerButtonGradient}
                >
                  <Text style={styles.registerButtonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </LinearGradient>
      </View>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    alignItems: "center",
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  title: {
    ...theme.typography.largeTitle,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    ...theme.typography.callout,
    color: theme.colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 180,
  },
  rateCard: {
    marginBottom: theme.spacing.md,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currencySection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flagImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
  },
  currencyText: {
    flex: 1,
  },
  currencyCode: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
  currencyName: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  rateBox: {
    alignItems: "center",
    minWidth: 70,
  },
  rateLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  rateValue: {
    ...theme.typography.callout,
    fontWeight: "700",
  },
  buyRate: {
    color: theme.colors.success,
  },
  sellRate: {
    color: theme.colors.danger,
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyText: {
    ...theme.typography.callout,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerGradient: {
    paddingTop: 80,
    paddingBottom: 34,
  },
  ctaCard: {
    marginHorizontal: theme.spacing.lg,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  ctaSubtitle: {
    ...theme.typography.footnote,
    color: theme.colors.text.secondary,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  loginButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
  },
  loginButtonText: {
    ...theme.typography.headline,
    color: theme.colors.primary,
  },
  registerButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  registerButtonGradient: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  registerButtonText: {
    ...theme.typography.headline,
    color: "#fff",
  },
});