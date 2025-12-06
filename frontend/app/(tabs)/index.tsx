// dashboard screen - exchange rates
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { getCurrentRates, ExchangeRate } from '../../services/ratesService';
import CurrencyCard from '../../components/CurrencyCard';

export default function HomeScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // fetch rates on mount
  useEffect(() => {
    fetchRates();
  }, []);

  // fetch rates from API
  const fetchRates = async () => {
    try {
      setLoading(true);
      const data = await getCurrentRates();
      setRates(data);
    } catch (error: any) {
      Alert.alert('Błąd', 'Nie udało się pobrać kursów walut');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // pull to refresh
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await getCurrentRates();
      setRates(data);
    } catch (error: any) {
      Alert.alert('Błąd', 'Nie udało się odświeżyć kursów');
    } finally {
      setRefreshing(false);
    }
  };

  // handle logout
  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  // loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Ładowanie kursów...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Witaj, {user?.firstName}!</Text>
          <Text style={styles.subtitle}>Aktualne kursy walut</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Wyloguj</Text>
        </TouchableOpacity>
      </View>

      {/* rates list */}
      <FlatList
        data={rates}
        keyExtractor={(item) => item.currencyCode}
        renderItem={({ item }) => <CurrencyCard rate={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Brak kursów walut</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});