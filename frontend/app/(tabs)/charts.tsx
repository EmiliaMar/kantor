import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { getHistoricalRates } from "../../services/ratesService";
import GlassCard from "../../components/GlassCard";
import { theme } from "../../constants/theme";

const screenWidth = Dimensions.get("window").width;

export default function ChartsScreen() {
  const [currency, setCurrency] = useState("EUR");
  const [period, setPeriod] = useState(7);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currencies = ["EUR", "USD", "GBP", "CHF"];
  const periods = [
    { label: "7D", value: 7 },
    { label: "14D", value: 14 },
    { label: "30D", value: 30 },
  ];

  useEffect(() => {
    fetchData();
  }, [currency, period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const rates = await getHistoricalRates(currency, period);
      setData(rates);
    } catch (error) {
      console.error("error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: data.map((item) => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: data.map((item) => item.rate),
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 4,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.lg,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "rgba(200, 200, 200, 0.3)",
      strokeWidth: 1,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  const stats =
    data.length > 0
      ? {
          min: Math.min(...data.map((d) => d.rate)),
          max: Math.max(...data.map((d) => d.rate)),
          avg: data.reduce((sum, d) => sum + d.rate, 0) / data.length,
        }
      : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Charts</Text>
          <Text style={styles.subtitle}>Historical analysis</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.currencyButtons}>
            {currencies.map((curr) => (
              <TouchableOpacity
                key={curr}
                style={[
                  styles.currencyButton,
                  currency === curr && styles.currencyButtonActive,
                ]}
                onPress={() => setCurrency(curr)}
              >
                {currency === curr && (
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <Text
                  style={[
                    styles.currencyButtonText,
                    currency === curr && styles.currencyButtonTextActive,
                  ]}
                >
                  {curr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Period</Text>
          <View style={styles.periodButtons}>
            {periods.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.periodButton,
                  period === p.value && styles.periodButtonActive,
                ]}
                onPress={() => setPeriod(p.value)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    period === p.value && styles.periodButtonTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : data.length > 0 ? (
          <GlassCard style={styles.chartCard}>
            <Text style={styles.chartTitle}>{currency}/PLN</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={chartData}
                width={Math.max(screenWidth - 80, data.length * 50)}
                height={220}
                chartConfig={chartConfig}
                bezier
                withVerticalLines={false}
                withHorizontalLines={true}
                withInnerLines={true}
                withOuterLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                style={styles.chart}
              />
            </ScrollView>

            {stats && (
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Min</Text>
                  <Text
                    style={[styles.statValue, { color: theme.colors.danger }]}
                  >
                    {stats.min.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Avg</Text>
                  <Text style={styles.statValue}>{stats.avg.toFixed(4)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Max</Text>
                  <Text
                    style={[styles.statValue, { color: theme.colors.success }]}
                  >
                    {stats.max.toFixed(4)}
                  </Text>
                </View>
              </View>
            )}
          </GlassCard>
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No data available</Text>
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
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  currencyButtonActive: {
    borderColor: "transparent",
  },
  currencyButtonText: {
    ...theme.typography.headline,
    color: theme.colors.text.secondary,
  },
  currencyButtonTextActive: {
    color: "#fff",
  },
  periodButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary + "15",
    borderColor: theme.colors.primary,
  },
  periodButtonText: {
    ...theme.typography.callout,
    color: theme.colors.text.secondary,
    fontWeight: "600",
  },
  periodButtonTextActive: {
    color: theme.colors.primary,
  },
  loadingContainer: {
    padding: 60,
    alignItems: "center",
  },
  chartCard: {
    marginBottom: theme.spacing.lg,
  },
  chartTitle: {
    ...theme.typography.title3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  chart: {
    marginVertical: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.background + "60",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    ...theme.typography.callout,
    color: theme.colors.text.primary,
    fontWeight: "700",
  },
  emptyCard: {
    padding: 60,
    alignItems: "center",
  },
  emptyText: {
    ...theme.typography.callout,
    color: theme.colors.text.secondary,
  },
});
