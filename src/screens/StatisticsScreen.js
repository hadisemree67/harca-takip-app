import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/formatUtils';

const TIME_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

const StatisticsScreen = () => {
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  const {
    getCategoryExpenses,
    getDailyExpenses,
    getWeeklyExpenses,
    getYearlyExpenses,
    getDailyAnalysis,
    getMonthSummary,
    categories,
  } = useTransactions();

  const [selectedPeriod, setSelectedPeriod] = useState(TIME_PERIODS.MONTHLY);

  const categoryExpenses = getCategoryExpenses();
  const dailyExpenses = getDailyExpenses();
  const weeklyExpenses = getWeeklyExpenses();
  const yearlyExpenses = getYearlyExpenses();
  const dailyAnalysis = getDailyAnalysis();
  const { expense: totalExpense } = getMonthSummary();

  // Pie Chart için veri hazırlama
  const pieData = Object.entries(categoryExpenses).map(([categoryId, amount]) => {
    const category = categories.find((cat) => cat.id === categoryId);
    const categoryName = category
      ? (category.nameKey ? t(category.nameKey) : category.name)
      : t('other');
    return {
      name: categoryName,
      amount,
      color: category?.color || '#6B7280',
      legendFontColor: colors.text,
      legendFontSize: 12,
    };
  });

  // En yüksek harcama kategorisi
  const maxCategory = pieData.reduce(
    (max, cat) => (cat.amount > max.amount ? cat : max),
    { name: '', amount: 0 }
  );

  // Periyoda göre grafik verisi hazırlama
  const getChartData = () => {
    switch (selectedPeriod) {
      case TIME_PERIODS.DAILY: {
        const days = Object.keys(dailyExpenses).sort((a, b) => Number(a) - Number(b));
        return {
          labels: days.map((day) => `${day}.`),
          datasets: [{ data: days.map((day) => dailyExpenses[day]) }],
        };
      }
      case TIME_PERIODS.WEEKLY: {
        const weeks = [1, 2, 3, 4, 5];
        return {
          labels: weeks.map((w) => `${w}. ${t('weekShort')}`),
          datasets: [{ data: weeks.map((w) => weeklyExpenses[w] || 0) }],
        };
      }
      case TIME_PERIODS.YEARLY: {
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const monthNames = language === 'tr'
          ? ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          labels: monthNames,
          datasets: [{ data: months.map((m) => yearlyExpenses[m] || 0) }],
        };
      }
      default: {
        const days = Object.keys(dailyExpenses).sort((a, b) => Number(a) - Number(b));
        return {
          labels: days.slice(-10).map((day) => `${day}.`),
          datasets: [{ data: days.slice(-10).map((day) => dailyExpenses[day]) }],
        };
      }
    }
  };

  const chartData = getChartData();

  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case TIME_PERIODS.DAILY:
        return t('dailyExpensesTitle');
      case TIME_PERIODS.WEEKLY:
        return t('weeklyExpensesTitle');
      case TIME_PERIODS.MONTHLY:
        return t('monthlyDailyExpensesTitle');
      case TIME_PERIODS.YEARLY:
        return t('yearlyMonthlyExpensesTitle');
      default:
        return t('dailyExpenses');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Kategori Dağılımı */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          {t('categoryDistribution')}
        </Text>

        {pieData.length > 0 ? (
          <>
            <PieChart
              data={pieData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft={15}
              absolute={true}
            />

            {maxCategory.amount > 0 && (
              <View style={styles.insightContainer}>
                <View style={styles.insightHeader}>
                  <MaterialIcons name="lightbulb" size={16} color={colors.primary} />
                  <Text style={[styles.insightText, { color: colors.textSecondary }]}>
                    {t('insightMostCategory', { category: maxCategory.name, amount: formatCurrency(maxCategory.amount) })}
                  </Text>
                </View>
              </View>
            )}

            {/* Kategori Detayları */}
            <View style={styles.categoriesDetail}>
              {pieData
                .sort((a, b) => b.amount - a.amount)
                .map((cat, index) => (
                  <View key={index} style={styles.categoryRow}>
                    <View style={styles.categoryLeft}>
                      <View
                        style={[styles.colorDot, { backgroundColor: cat.color }]}
                      />
                      <Text style={[styles.categoryName, { color: colors.text }]}>
                        {cat.name}
                      </Text>
                    </View>
                    <View style={styles.categoryRight}>
                      <Text style={[styles.categoryAmount, { color: colors.text }]}>
                        {formatCurrency(cat.amount)}
                      </Text>
                      <Text
                        style={[styles.categoryPercentage, { color: colors.textSecondary }]}
                      >
                        {((cat.amount / totalExpense) * 100).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('noExpenseData')}
            </Text>
          </View>
        )}
      </View>

      {/* Zaman Periyodu Seçici */}
      <View style={[styles.periodSelector, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === TIME_PERIODS.DAILY && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedPeriod(TIME_PERIODS.DAILY)}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: selectedPeriod === TIME_PERIODS.DAILY ? '#FFFFFF' : colors.text },
            ]}
          >
            {t('daily')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === TIME_PERIODS.WEEKLY && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedPeriod(TIME_PERIODS.WEEKLY)}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: selectedPeriod === TIME_PERIODS.WEEKLY ? '#FFFFFF' : colors.text },
            ]}
          >
            {t('weekly')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === TIME_PERIODS.MONTHLY && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedPeriod(TIME_PERIODS.MONTHLY)}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: selectedPeriod === TIME_PERIODS.MONTHLY ? '#FFFFFF' : colors.text },
            ]}
          >
            {t('monthly')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === TIME_PERIODS.YEARLY && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedPeriod(TIME_PERIODS.YEARLY)}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: selectedPeriod === TIME_PERIODS.YEARLY ? '#FFFFFF' : colors.text },
            ]}
          >
            {t('yearly')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Günlük Analiz (sadece günlük seçildiğinde) */}
      {selectedPeriod === TIME_PERIODS.DAILY && dailyAnalysis.highest && (
        <View style={[styles.analysisContainer, { backgroundColor: colors.card }]}>
          <View style={styles.titleRow}>
            <MaterialIcons name="analytics" size={20} color={colors.primary} />
            <Text style={[styles.chartTitle, { color: colors.text, marginBottom: 0 }]}>
              {t('dailyExpenseAnalysis')}
            </Text>
          </View>

          <View style={styles.analysisRow}>
            <View style={[styles.analysisCard, { backgroundColor: '#10B98120' }]}>
              <MaterialIcons name="trending-down" size={24} color="#10B981" />
              <Text style={[styles.analysisLabel, { color: colors.textSecondary }]}>
                {t('lowestExpense')}
              </Text>
              <Text style={[styles.analysisDay, { color: colors.text }]}>
                {dailyAnalysis.lowest.day}. {t('dayShort')}
              </Text>
              <Text style={[styles.analysisAmount, { color: '#10B981' }]}>
                {formatCurrency(dailyAnalysis.lowest.amount)}
              </Text>
            </View>

            <View style={[styles.analysisCard, { backgroundColor: '#EF444420' }]}>
              <MaterialIcons name="trending-up" size={24} color="#EF4444" />
              <Text style={[styles.analysisLabel, { color: colors.textSecondary }]}>
                {t('highestExpense')}
              </Text>
              <Text style={[styles.analysisDay, { color: colors.text }]}>
                {dailyAnalysis.highest.day}. {t('dayShort')}
              </Text>
              <Text style={[styles.analysisAmount, { color: '#EF4444' }]}>
                {formatCurrency(dailyAnalysis.highest.amount)}
              </Text>
            </View>
          </View>

          <View style={styles.insightContainer}>
            <View style={styles.insightHeader}>
              <MaterialIcons name="lightbulb" size={16} color={colors.primary} />
              <Text style={[styles.insightText, { color: colors.textSecondary }]}>
                {t('insightDailyAnalysis', {
                  days: dailyAnalysis.totalDays,
                  average: formatCurrency(dailyAnalysis.average),
                  day: dailyAnalysis.highest.day,
                  amount: formatCurrency(dailyAnalysis.highest.amount)
                })}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Harcama Grafiği */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>
          {getPeriodTitle()}
        </Text>

        {chartData.datasets[0].data.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <BarChart
              data={chartData}
              width={Math.max(Dimensions.get('window').width - 40, chartData.labels.length * 50)}
              height={220}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.textSecondary,
                style: { borderRadius: 16 },
              }}
              style={styles.chart}
              showValuesOnTopOfBars={true}
              fromZero={true}
            />
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('noExpenseDataPeriod')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  insightContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  categoriesDetail: {
    marginTop: 20,
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryPercentage: {
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statSubValue: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  periodSelector: {
    margin: 20,
    marginTop: 0,
    padding: 8,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  analysisContainer: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  analysisRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  analysisCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  analysisLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  analysisDay: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  analysisAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatisticsScreen;
