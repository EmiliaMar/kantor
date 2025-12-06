// currency card component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExchangeRate } from '../services/ratesService';

interface CurrencyCardProps {
  rate: ExchangeRate;
}

export default function CurrencyCard({ rate }: CurrencyCardProps) {
  return (
    <View style={styles.card}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.currencyCode}>{rate.currencyCode}</Text>
        <Text style={styles.currencyName}>{rate.currencyName}</Text>
      </View>

      {/* rates */}
      <View style={styles.ratesContainer}>
        {/* buy rate */}
        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>Kupno</Text>
          <Text style={[styles.rateValue, styles.buyRate]}>
            {rate.buyRate.toFixed(4)} PLN
          </Text>
        </View>

        {/* sell rate */}
        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>Sprzedaż</Text>
          <Text style={[styles.rateValue, styles.sellRate]}>
            {rate.sellRate.toFixed(4)} PLN
          </Text>
        </View>
      </View>

      {/* footer */}
      <Text style={styles.date}>
        Aktualizacja: {new Date(rate.lastUpdated).toLocaleString('pl-PL')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  currencyCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rateBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  rateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  buyRate: {
    color: '#27ae60',
  },
  sellRate: {
    color: '#e74c3c',
  },
  date: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
});