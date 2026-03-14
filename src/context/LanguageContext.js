import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

const translations = {
  tr: {
    // Navigation
    dashboard: 'Ana Sayfa',
    transactions: 'İşlemler',
    statistics: 'İstatistikler',
    settings: 'Ayarlar',

    // Dashboard
    monthlyIncome: 'Aylık Gelir',
    monthlyExpense: 'Aylık Gider',
    balance: 'Bakiye',
    dailyExpenses: 'Günlük Harcamalar',

    // Transactions
    addTransaction: 'İşlem Ekle',
    editTransaction: 'İşlem Düzenle',
    noTransactions: 'Henüz işlem yok',
    addTransactionHint: '+ butonuna basarak yeni işlem ekleyin',
    deleteConfirm: 'Bu işlemi silmek istediğinizden emin misiniz?',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',

    // Add Transaction
    expense: 'Gider',
    income: 'Gelir',
    amount: 'Tutar',
    category: 'Kategori',
    description: 'Açıklama',
    descriptionOptional: 'Açıklama (Opsiyonel)',
    descriptionPlaceholder: 'Not ekleyin...',
    date: 'Tarih',
    save: 'Kaydet',
    update: 'Güncelle',
    addCategory: 'Kategori Ekle',
    categoryName: 'Kategori adı (örn: Kozmetik)',
    emoji: 'Emoji',
    color: 'Renk',
    selectEmojiFromKeyboard: 'Klavyenizden emoji seçin',

    // Categories
    food: 'Yemek',
    transport: 'Ulaşım',
    entertainment: 'Eğlence',
    bills: 'Faturalar',
    shopping: 'Alışveriş',
    health: 'Sağlık',
    sports: 'Spor',
    education: 'Eğitim',
    cafe: 'Kafe',

    // Statistics
    categoryDistribution: 'Kategori Dağılımı',
    noExpenseData: 'Henüz gider kaydı yok',
    noExpenseDataPeriod: 'Henüz harcama verisi yok',
    dailyExpenseAnalysis: 'Günlük Harcama Analizi',
    lowestExpense: 'En Az Harcama',
    highestExpense: 'En Çok Harcama',
    day: 'Gün',
    daily: 'Günlük',
    weekly: 'Haftalık',
    monthly: 'Aylık',
    yearly: 'Yıllık',
    dailyExpensesTitle: 'Günlük Harcamalar',
    weeklyExpensesTitle: 'Haftalık Harcamalar',
    monthlyDailyExpensesTitle: 'Aylık Günlük Harcamalar',
    yearlyMonthlyExpensesTitle: 'Yıllık Aylık Harcamalar',

    // Settings
    theme: 'Tema',
    language: 'Dil',
    lightMode: 'Açık Tema',
    darkMode: 'Karanlık Tema',
    turkish: 'Türkçe',
    english: 'English',

    // Messages
    success: 'Başarılı',
    error: 'Hata',
    transactionSaved: 'İşlem kaydedildi',
    transactionUpdated: 'İşlem güncellendi',
    categorySaved: 'Yeni kategori eklendi',
    categoryDeleted: 'Kategori silindi',
    deleteCategoryConfirm: '{category} kategorisini silmek istediğinize emin misiniz?',
    enterValidAmount: 'Lütfen geçerli bir tutar girin',
    enterCategoryName: 'Lütfen kategori adı girin',
    enterEmoji: 'Lütfen bir emoji girin',
    ok: 'Tamam',

    // Insights
    insightMostCategory: 'Bu ay paranızın çoğu {category} kategorisine harcandı ({amount})',
    insightDailyAnalysis: 'Bu ay {days} günde harcama yaptınız. Ortalama günlük harcamanız {average}. En çok harcadığınız gün {day}. gündü ({amount}).',

    // Misc
    appearance: 'GÖRÜNÜM',
    personalizeApp: 'Uygulamanızı kişiselleştirin',
    week: 'Hafta',
    currencySymbol: '₺',
    amountPlaceholder: '0.00',

    // Dashboard
    totalIncome: 'Toplam Gelir',
    totalExpense: 'Toplam Gider',
    remainingBalance: 'Kalan Bakiye',
    dailySpendingTrend: 'Günlük Harcama Trendi',
    highestSpendingDay: 'En yüksek harcama {day}. gün: {amount}',
    noExpenseDataThisMonth: 'Bu ay henüz harcama kaydı yok',

    // Statistics - already exist but adding more
    other: 'Diğer',
    weekShort: 'Hafta',
    dayShort: 'Gün',

    // Months
    january: 'Ocak',
    february: 'Şubat',
    march: 'Mart',
    april: 'Nisan',
    may: 'Mayıs',
    june: 'Haziran',
    july: 'Temmuz',
    august: 'Ağustos',
    september: 'Eylül',
    october: 'Ekim',
    november: 'Kasım',
    december: 'Aralık',
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    statistics: 'Statistics',
    settings: 'Settings',

    // Dashboard
    monthlyIncome: 'Monthly Income',
    monthlyExpense: 'Monthly Expense',
    balance: 'Balance',
    dailyExpenses: 'Daily Expenses',

    // Transactions
    addTransaction: 'Add Transaction',
    editTransaction: 'Edit Transaction',
    noTransactions: 'No transactions yet',
    addTransactionHint: 'Press + button to add new transaction',
    deleteConfirm: 'Are you sure you want to delete this transaction?',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',

    // Add Transaction
    expense: 'Expense',
    income: 'Income',
    amount: 'Amount',
    category: 'Category',
    description: 'Description',
    descriptionOptional: 'Description (Optional)',
    descriptionPlaceholder: 'Add a note...',
    date: 'Date',
    save: 'Save',
    update: 'Update',
    addCategory: 'Add Category',
    categoryName: 'Category name (e.g.: Cosmetics)',
    emoji: 'Emoji',
    color: 'Color',
    selectEmojiFromKeyboard: 'Select emoji from your keyboard',

    // Categories
    food: 'Food',
    transport: 'Transport',
    entertainment: 'Entertainment',
    bills: 'Bills',
    shopping: 'Shopping',
    health: 'Health',
    sports: 'Sports',
    education: 'Education',
    cafe: 'Cafe',

    // Statistics
    categoryDistribution: 'Category Distribution',
    noExpenseData: 'No expense data yet',
    noExpenseDataPeriod: 'No expense data yet',
    dailyExpenseAnalysis: 'Daily Expense Analysis',
    lowestExpense: 'Lowest Expense',
    highestExpense: 'Highest Expense',
    day: 'Day',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    dailyExpensesTitle: 'Daily Expenses',
    weeklyExpensesTitle: 'Weekly Expenses',
    monthlyDailyExpensesTitle: 'Monthly Daily Expenses',
    yearlyMonthlyExpensesTitle: 'Yearly Monthly Expenses',

    // Settings
    theme: 'Theme',
    language: 'Language',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    turkish: 'Türkçe',
    english: 'English',

    // Messages
    success: 'Success',
    error: 'Error',
    transactionSaved: 'Transaction saved',
    transactionUpdated: 'Transaction updated',
    categorySaved: 'New category added',
    categoryDeleted: 'Category deleted',
    deleteCategoryConfirm: 'Are you sure you want to delete {category} category?',
    enterValidAmount: 'Please enter a valid amount',
    enterCategoryName: 'Please enter category name',
    enterEmoji: 'Please enter an emoji',
    ok: 'OK',

    // Insights
    insightMostCategory: 'Most of your money this month went to {category} category ({amount})',
    insightDailyAnalysis: 'You made expenses on {days} days this month. Your average daily expense is {average}. Your highest spending was on day {day} ({amount}).',

    // Misc
    appearance: 'APPEARANCE',
    personalizeApp: 'Personalize your app',
    week: 'Week',
    currencySymbol: '$',
    amountPlaceholder: '0.00',

    // Dashboard
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    remainingBalance: 'Remaining Balance',
    dailySpendingTrend: 'Daily Spending Trend',
    highestSpendingDay: 'Highest spending on day {day}: {amount}',
    noExpenseDataThisMonth: 'No expense data this month yet',

    // Statistics - already exist but adding more
    other: 'Other',
    weekShort: 'Week',
    dayShort: 'Day',

    // Months
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('tr');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('@harcatakip_language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Dil yüklenemedi:', error);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('@harcatakip_language', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Dil kaydedilemedi:', error);
    }
  };

  const t = (key, params = {}) => {
    let text = translations[language][key] || key;

    // Replace parameters like {category}, {amount}, etc.
    Object.keys(params).forEach((param) => {
      text = text.replace(`{${param}}`, params[param]);
    });

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
