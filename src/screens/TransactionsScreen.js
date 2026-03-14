import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import { TRANSACTION_TYPES } from '../constants/categories';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatUtils';

const TransactionsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { getMonthTransactions, deleteTransaction, categories } = useTransactions();
  const { t } = useLanguage();

  const transactions = getMonthTransactions().sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handleDelete = (id) => {
    Alert.alert(
      t('delete'),
      t('deleteConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0];
  };

  const renderTransaction = ({ item }) => {
    const categoryInfo = getCategoryInfo(item.category);
    const isExpense = item.type === TRANSACTION_TYPES.EXPENSE;

    return (
      <View style={[styles.transactionCard, { backgroundColor: colors.card }]}>
        <View style={styles.transactionLeft}>
          {isExpense && (
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: categoryInfo.color + '20' },
              ]}
            >
              {categoryInfo.iconLib === 'MaterialIcons' || categoryInfo.iconLib === undefined ? (
                <MaterialIcons
                  name={categoryInfo.icon}
                  size={24}
                  color={categoryInfo.color}
                />
              ) : (
                <Text style={styles.categoryEmoji}>{categoryInfo.icon}</Text>
              )}
            </View>
          )}
          {!isExpense && (
            <View
              style={[styles.categoryIcon, { backgroundColor: colors.income + '20' }]}
            >
              <MaterialIcons name="trending-up" size={24} color={colors.income} />
            </View>
          )}

          <View style={styles.transactionInfo}>
            <Text style={[styles.transactionTitle, { color: colors.text }]}>
              {isExpense ? (categoryInfo.nameKey ? t(categoryInfo.nameKey) : categoryInfo.name) : t('income')}
            </Text>
            {item.description ? (
              <Text
                style={[styles.transactionDescription, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.description}
              </Text>
            ) : null}
            <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>

        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isExpense ? colors.expense : colors.income },
            ]}
          >
            {isExpense ? '-' : '+'}
            {formatCurrency(item.amount)}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('AddTransaction', { transaction: item })}
            >
              <MaterialIcons name="edit" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <MaterialIcons name="delete" size={18} color={colors.expense} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="receipt-long" size={64} color={colors.textSecondary} style={{ opacity: 0.3 }} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {t('noTransactions')}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
        {t('addTransactionHint')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <MaterialIcons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 14,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
  },
});

export default TransactionsScreen;
