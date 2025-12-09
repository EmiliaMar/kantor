import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { getTransactionHistory } from "../../services/transactionService";
import GlassCard from "../../components/GlassCard";
import { theme } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

interface Transaction {
  id: string;
  type: string;
  fromCurrency: string | null;
  toCurrency: string;
  amount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      const response = await getTransactionHistory(pageNum, 20);

      if (pageNum === 1) {
        setTransactions(response.transactions);
      } else {
        setTransactions((prev) => [...prev, ...response.transactions]);
      }

      setPage(pageNum);
      setHasMore(response.hasMore);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchTransactions(1);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchTransactions(page + 1);
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return {
          icon: "add-circle" as const,
          color: theme.colors.success,
          label: "Deposit",
        };
      case "BUY":
        return {
          icon: "arrow-down-circle" as const,
          color: theme.colors.primary,
          label: "Buy",
        };
      case "SELL":
        return {
          icon: "arrow-up-circle" as const,
          color: theme.colors.danger,
          label: "Sell",
        };
      default:
        return {
          icon: "help-circle" as const,
          color: theme.colors.text.secondary,
          label: "Other",
        };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDescription = (transaction: Transaction) => {
    if (transaction.type === "DEPOSIT") {
      return "Wallet deposit";
    }
    return `${transaction.fromCurrency} → ${transaction.toCurrency}`;
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
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>All your transactions</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const typeInfo = getTypeInfo(item.type);
          return (
            <GlassCard style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: typeInfo.color + "15" },
                  ]}
                >
                  <Ionicons
                    name={typeInfo.icon}
                    size={24}
                    color={typeInfo.color}
                  />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>{typeInfo.label}</Text>
                  <Text style={styles.transactionDescription}>
                    {getDescription(item)}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>

                <View style={styles.transactionAmount}>
                  <Text style={[styles.amount, { color: typeInfo.color }]}>
                    {item.type === "DEPOSIT" ? "+" : ""}
                    {item.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.currency}>{item.toCurrency}</Text>
                </View>
              </View>
            </GlassCard>
          );
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="receipt-outline"
              size={64}
              color={theme.colors.text.tertiary}
            />
            <Text style={styles.emptyText}>No transactions</Text>
            <Text style={styles.emptySubtext}>
              Start trading to see your history
            </Text>
          </View>
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
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
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
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  transactionCard: {
    marginBottom: theme.spacing.md,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  transactionDescription: {
    ...theme.typography.footnote,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  transactionDate: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  transactionAmount: {
    alignItems: "flex-end",
  },
  amount: {
    ...theme.typography.title3,
    fontWeight: "700",
  },
  currency: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyText: {
    ...theme.typography.title2,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.subheadline,
    color: theme.colors.text.secondary,
  },
});
