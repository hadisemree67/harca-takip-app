import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveTransactions, getTransactions } from '../services/storageService';
import { TRANSACTION_TYPES, DEFAULT_CATEGORIES } from '../constants/categories';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);

  const loadTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const loadCategories = async () => {
    try {
      const saved = await AsyncStorage.getItem('@harcatakip_categories');
      if (saved) {
        const savedCategories = JSON.parse(saved);

        // Migration: Update old categories with new name and nameKey fields
        const updatedCategories = savedCategories.map(cat => {
          // Find matching default category
          const defaultCat = DEFAULT_CATEGORIES.find(dc => dc.id === cat.id);
          if (defaultCat && !cat.nameKey) {
            // Merge with default category to get name and nameKey
            return { ...cat, name: defaultCat.name, nameKey: defaultCat.nameKey };
          }
          return cat;
        });

        setCategories(updatedCategories);
        // Save updated categories back to storage
        await AsyncStorage.setItem('@harcatakip_categories', JSON.stringify(updatedCategories));
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const saveCategories = async (newCategories) => {
    try {
      await AsyncStorage.setItem('@harcatakip_categories', JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Kategoriler kaydedilemedi:', error);
    }
  };

  const addCategory = async (category) => {
    const newCategory = {
      ...category,
      id: `custom_${Date.now()}`,
      isCustom: true,
      iconLib: category.iconLib || 'emoji',
    };
    const updated = [...categories, newCategory];
    await saveCategories(updated);
  };

  const deleteCategory = async (categoryId) => {
    const updated = categories.filter(cat => cat.id !== categoryId);
    await saveCategories(updated);
  };

  const addTransaction = async (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      createdAt: new Date().toISOString(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
  };

  const updateTransaction = async (id, updatedData) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === id ? { ...t, ...updatedData } : t
    );
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
  };

  const deleteTransaction = async (id) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
  };

  const getMonthTransactions = () => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === selectedMonth.getMonth() &&
        transactionDate.getFullYear() === selectedMonth.getFullYear()
      );
    });
  };

  const getMonthSummary = () => {
    const monthTransactions = getMonthTransactions();
    const income = monthTransactions
      .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expense = monthTransactions
      .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const balance = income - expense;

    return { income, expense, balance };
  };

  const getCategoryExpenses = () => {
    const monthTransactions = getMonthTransactions();
    const expenses = monthTransactions.filter(
      (t) => t.type === TRANSACTION_TYPES.EXPENSE
    );

    const categoryTotals = {};
    expenses.forEach((t) => {
      if (categoryTotals[t.category]) {
        categoryTotals[t.category] += parseFloat(t.amount);
      } else {
        categoryTotals[t.category] = parseFloat(t.amount);
      }
    });

    return categoryTotals;
  };

  const getDailyExpenses = () => {
    const monthTransactions = getMonthTransactions();
    const expenses = monthTransactions.filter(
      (t) => t.type === TRANSACTION_TYPES.EXPENSE
    );

    const dailyTotals = {};
    expenses.forEach((t) => {
      const day = new Date(t.date).getDate();
      if (dailyTotals[day]) {
        dailyTotals[day] += parseFloat(t.amount);
      } else {
        dailyTotals[day] = parseFloat(t.amount);
      }
    });

    return dailyTotals;
  };

  const getWeeklyExpenses = () => {
    const monthTransactions = getMonthTransactions();
    const expenses = monthTransactions.filter(
      (t) => t.type === TRANSACTION_TYPES.EXPENSE
    );

    const weeklyTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    expenses.forEach((t) => {
      const day = new Date(t.date).getDate();
      const week = Math.ceil(day / 7);
      weeklyTotals[week] = (weeklyTotals[week] || 0) + parseFloat(t.amount);
    });

    return weeklyTotals;
  };

  const getYearlyExpenses = () => {
    const currentYear = selectedMonth.getFullYear();
    const yearTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentYear;
    });

    const expenses = yearTransactions.filter(
      (t) => t.type === TRANSACTION_TYPES.EXPENSE
    );

    const monthlyTotals = {};
    expenses.forEach((t) => {
      const month = new Date(t.date).getMonth() + 1;
      if (monthlyTotals[month]) {
        monthlyTotals[month] += parseFloat(t.amount);
      } else {
        monthlyTotals[month] = parseFloat(t.amount);
      }
    });

    return monthlyTotals;
  };

  const getDailyAnalysis = () => {
    const dailyExpenses = getDailyExpenses();
    const days = Object.keys(dailyExpenses).map(Number);

    if (days.length === 0) {
      return { highest: null, lowest: null, average: 0, totalDays: 0 };
    }

    const amounts = days.map(day => dailyExpenses[day]);
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / days.length;

    const highestDay = days.reduce((max, day) =>
      dailyExpenses[day] > dailyExpenses[max] ? day : max
    , days[0]);

    const lowestDay = days.reduce((min, day) =>
      dailyExpenses[day] < dailyExpenses[min] ? day : min
    , days[0]);

    return {
      highest: { day: highestDay, amount: dailyExpenses[highestDay] },
      lowest: { day: lowestDay, amount: dailyExpenses[lowestDay] },
      average,
      totalDays: days.length,
    };
  };

  const nextMonth = () => {
    const next = new Date(selectedMonth);
    next.setMonth(next.getMonth() + 1);
    setSelectedMonth(next);
  };

  const previousMonth = () => {
    const prev = new Date(selectedMonth);
    prev.setMonth(prev.getMonth() - 1);
    setSelectedMonth(prev);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        selectedMonth,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getMonthTransactions,
        getMonthSummary,
        getCategoryExpenses,
        getDailyExpenses,
        getWeeklyExpenses,
        getYearlyExpenses,
        getDailyAnalysis,
        nextMonth,
        previousMonth,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
