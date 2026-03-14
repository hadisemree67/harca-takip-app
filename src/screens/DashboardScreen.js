import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/formatUtils';
import { getMonthYear, getDaysInMonth } from '../utils/dateUtils';

const DashboardScreen = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const {
    getMonthSummary,
    getDailyExpenses,
    selectedMonth,
    previousMonth,
    nextMonth,
  } = useTransactions();

  const { income, expense, balance } = getMonthSummary();
  const dailyExpenses = getDailyExpenses();
  const daysInMonth = getDaysInMonth(selectedMonth);

  // Grafik verisi hazırlama
  const chartData = [];
  const chartLabels = [];
  for (let day = 1; day <= daysInMonth; day++) {
    chartData.push(dailyExpenses[day] || 0);
    // Her 5 günde bir label göster
    if (day % 5 === 1 || day === daysInMonth) {
      chartLabels.push(day.toString());
    } else {
      chartLabels.push('');
    }
  }

  const maxExpense = Math.max(...chartData, 1);
  const maxDay = chartData.indexOf(maxExpense) + 1;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Ay Seçici */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={previousMonth} style={styles.monthButton}>
          <MaterialIcons name="chevron-left" size={32} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.monthText, { color: colors.text }]}>
          {getMonthYear(selectedMonth, t)}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
          <MaterialIcons name="chevron-right" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Özet Kartları */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="trending-up" size={24} color={colors.income} />
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {t('totalIncome')}
            </Text>
          </View>
          <Text style={[styles.summaryAmount, { color: colors.income }]}>
            {formatCurrency(income)}
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="trending-down" size={24} color={colors.expense} />
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {t('totalExpense')}
            </Text>
          </View>
          <Text style={[styles.summaryAmount, { color: colors.expense }]}>
            {formatCurrency(expense)}
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color={balance >= 0 ? colors.income : colors.expense}
            />
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {t('remainingBalance')}
            </Text>
          </View>
          <Text
            style={[
              styles.summaryAmount,
              { color: balance >= 0 ? colors.income : colors.expense },
            ]}
          >
            {formatCurrency(balance)}
          </Text>
        </View>
      </View>

      {/* Gider Trendi Grafiği */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          {t('dailySpendingTrend')}
        </Text>
        {chartData.some((val) => val > 0) ? (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <LineChart
                data={{
                  labels: chartLabels,
                  datasets: [{ data: chartData }],
                }}
                width={Math.max(Dimensions.get('window').width - 40, daysInMonth * 12)}
                height={220}
                chartConfig={{
                  backgroundColor: colors.card,
                  backgroundGradientFrom: colors.card,
                  backgroundGradientTo: colors.card,
                  decimalPlaces: 0,
                  color: (opacity = 1) => colors.primary,
                  labelColor: (opacity = 1) => colors.textSecondary,
                  style: { borderRadius: 16 },
                  propsForDots: {
                    r: 4,
                    strokeWidth: 2,
                    stroke: colors.primary,
                  },
                }}
                bezier={true}
                style={styles.chart}
              />
            </ScrollView>
            {maxExpense > 0 && (
              <View style={styles.insightContainer}>
                <Text style={[styles.insightText, { color: colors.textSecondary }]}>
                  💡 {t('highestSpendingDay', { day: maxDay, amount: formatCurrency(maxExpense) })}
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('noExpenseDataThisMonth')}
            </Text>
          </View>
        )}
      </View>

      {/* Logo Footer */}
      <View style={styles.logoFooter}>
        <Image
          source={require('../../assets/image-Photoroom.png')}
          style={styles.footerLogo}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  chartContainer: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  logoFooter: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerLogo: {
    width: 200,
    height: 120,
  },
});

export default DashboardScreen;
