import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import { getCurrentRates, ExchangeRate } from "../../services/ratesService";
import { useAuth } from "../../context/AuthContext";
import GlassCard from "../../components/GlassCard";
import { theme } from "../../constants/theme";
import { currencyFlags } from "../../constants/flags";

export default function DashboardScreen() {
  const { user } = useAuth();
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}></View>

      <FlatList
        data={rates}
        keyExtractor={(item) => item.currencyCode}
        renderItem={({ item }) => (
          <GlassCard style={styles.rateCard}>
            <View style={styles.rateRow}>
              <View style={styles.currencySection}>
                <Image
                  source={currencyFlags[item.currencyCode]}
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
                <Text
                  style={[styles.rateValue, { color: theme.colors.success }]}
                >
                  {item.buyRate.toFixed(4)}
                </Text>
              </View>

              <View style={styles.rateBox}>
                <Text style={styles.rateLabel}>Sell</Text>
                <Text
                  style={[styles.rateValue, { color: theme.colors.danger }]}
                >
                  {item.sellRate.toFixed(4)}
                </Text>
              </View>
            </View>
          </GlassCard>
        )}
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
    paddingTop: 10,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    ...theme.typography.largeTitle,
    color: theme.colors.text.primary,
    marginBottom: 4,
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
  subtitle: {
    ...theme.typography.subheadline,
    color: theme.colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  rateCard: {
    marginBottom: theme.spacing.md,
  },

  currencyIcon: {
    fontSize: 24,
    color: theme.colors.primary,
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

  rateLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },

  rateValue: {
    ...theme.typography.callout,
    fontWeight: "700",
  },

  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currencyText: {
    flex: 1,
  },
  rateBox: {
    alignItems: "center",
    minWidth: 70,
  },
});
