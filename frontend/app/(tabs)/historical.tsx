import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getHistoricalRate } from "../../services/ratesService";
import GlassCard from "../../components/GlassCard";
import { theme } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function HistoricalRatesScreen() {
  const [currency, setCurrency] = useState("EUR");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [rate, setRate] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const currencies = ["EUR", "USD", "GBP", "CHF"];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m, 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  const fetchRate = async () => {
    try {
      setLoading(true);
      const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const data = await getHistoricalRate(currency, dateString);
      setRate(data);
    } catch (error: any) {
      setRate(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Historical Rates</Text>
          <Text style={styles.subtitle}>Check past exchange rates</Text>
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
          <Text style={styles.label}>Date</Text>

          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={styles.dateSelectorLabel}>Year</Text>
              <Text style={styles.dateSelectorValue}>{year}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowMonthPicker(true)}
            >
              <Text style={styles.dateSelectorLabel}>Month</Text>
              <Text style={styles.dateSelectorValue}>
                {monthNames[month - 1].slice(0, 3)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDayPicker(true)}
            >
              <Text style={styles.dateSelectorLabel}>Day</Text>
              <Text style={styles.dateSelectorValue}>{day}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkButton}
          onPress={fetchRate}
          disabled={loading}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkButtonGradient}
          >
            <Text style={styles.checkButtonText}>
              {loading ? "Loading..." : "Check Rate"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {rate && (
          <GlassCard style={styles.resultCard}>
            <Text style={styles.resultTitle}>{currency} / PLN</Text>
            <Text style={styles.resultDate}>
              {new Date(rate.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <View style={styles.rateRow}>
              <View style={styles.rateItem}>
                <Text style={styles.rateLabel}>Mid Rate</Text>
                <Text style={styles.rateValue}>{rate.midRate.toFixed(4)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.ratesGrid}>
              <View style={styles.gridItem}>
                <View style={styles.gridIcon}>
                  <Ionicons
                    name="arrow-down"
                    size={16}
                    color={theme.colors.success}
                  />
                </View>
                <Text style={styles.gridLabel}>Buy</Text>
                <Text
                  style={[styles.gridValue, { color: theme.colors.success }]}
                >
                  {rate.buyRate.toFixed(4)}
                </Text>
              </View>

              <View style={styles.gridDivider} />

              <View style={styles.gridItem}>
                <View style={styles.gridIcon}>
                  <Ionicons
                    name="arrow-up"
                    size={16}
                    color={theme.colors.danger}
                  />
                </View>
                <Text style={styles.gridLabel}>Sell</Text>
                <Text
                  style={[styles.gridValue, { color: theme.colors.danger }]}
                >
                  {rate.sellRate.toFixed(4)}
                </Text>
              </View>
            </View>
          </GlassCard>
        )}
      </ScrollView>

      {renderPickerModal(
        showYearPicker,
        () => setShowYearPicker(false),
        "Select Year",
        years,
        year,
        (item) => {
          setYear(item);
          setShowYearPicker(false);
        },
        (item) => String(item)
      )}

      {renderPickerModal(
        showMonthPicker,
        () => setShowMonthPicker(false),
        "Select Month",
        monthNames.map((name, index) => ({ name, value: index + 1 })),
        month,
        (item) => {
          setMonth(item.value);
          const maxDay = getDaysInMonth(year, item.value);
          if (day > maxDay) setDay(maxDay);
          setShowMonthPicker(false);
        },
        (item) => item.name,
        (item) => item.value
      )}

      {renderDayModal()}
    </View>
  );

  function renderPickerModal(
    visible: boolean,
    onClose: () => void,
    title: string,
    data: any[],
    selectedValue: any,
    onSelect: (item: any) => void,
    getLabel: (item: any) => string,
    getValue: (item: any) => any = (item) => item
  ) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={onClose}
          />
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <FlatList
              data={data}
              keyExtractor={(item, index) => String(getValue(item) || index)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    getValue(item) === selectedValue && styles.modalItemActive,
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      getValue(item) === selectedValue &&
                        styles.modalItemTextActive,
                    ]}
                  >
                    {getLabel(item)}
                  </Text>
                  {getValue(item) === selectedValue && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </GlassCard>
        </View>
      </Modal>
    );
  }

  function renderDayModal() {
    return (
      <Modal
        visible={showDayPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDayPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowDayPicker(false)}
          />
          <GlassCard style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Day</Text>
            <FlatList
              data={days}
              keyExtractor={(item) => String(item)}
              numColumns={7}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.dayItem, day === item && styles.dayItemActive]}
                  onPress={() => {
                    setDay(item);
                    setShowDayPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dayItemText,
                      day === item && styles.dayItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.dayGrid}
            />
          </GlassCard>
        </View>
      </Modal>
    );
  }
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
  dateRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  dateSelector: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  dateSelectorLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  dateSelectorValue: {
    ...theme.typography.title3,
    color: theme.colors.text.primary,
    fontWeight: "700",
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  selectedDate: {
    ...theme.typography.callout,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  checkButton: {
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
  },
  checkButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  checkButtonText: {
    ...theme.typography.headline,
    color: "#fff",
  },
  resultCard: {
    alignItems: "center",
  },
  resultTitle: {
    ...theme.typography.title1,
    color: theme.colors.text.primary,
    fontWeight: "700",
    marginBottom: 4,
  },
  resultDate: {
    ...theme.typography.footnote,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  rateRow: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  rateItem: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  rateLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  rateValue: {
    ...theme.typography.title2,
    color: theme.colors.text.primary,
    fontWeight: "700",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  ratesGrid: {
    flexDirection: "row",
    width: "100%",
  },
  gridItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  gridIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background + "60",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  gridLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  gridValue: {
    ...theme.typography.headline,
    fontWeight: "700",
  },
  gridDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    ...theme.typography.title3,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    fontWeight: "700",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemActive: {
    backgroundColor: theme.colors.primary + "10",
  },
  modalItemText: {
    ...theme.typography.callout,
    color: theme.colors.text.primary,
  },
  modalItemTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  dayGrid: {
    paddingHorizontal: theme.spacing.sm,
  },
  dayItem: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.sm,
    marginVertical: 2,
  },
  dayItemActive: {
    backgroundColor: theme.colors.primary,
  },
  dayItemText: {
    ...theme.typography.callout,
    color: theme.colors.text.primary,
  },
  dayItemTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
});
