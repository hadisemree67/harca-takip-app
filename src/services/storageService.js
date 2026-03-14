import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRANSACTIONS: '@harcatakip_transactions',
  THEME: '@harcatakip_theme',
};

// İşlem kaydetme ve okuma
export const saveTransactions = async (transactions) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('İşlemler kaydedilirken hata:', error);
    return false;
  }
};

export const getTransactions = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('İşlemler okunurken hata:', error);
    return [];
  }
};

// Tema kaydetme ve okuma
export const saveTheme = async (theme) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    return true;
  } catch (error) {
    console.error('Tema kaydedilirken hata:', error);
    return false;
  }
};

export const getTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return theme || 'light';
  } catch (error) {
    console.error('Tema okunurken hata:', error);
    return 'light';
  }
};

// Tüm verileri temizle
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Veriler temizlenirken hata:', error);
    return false;
  }
};
