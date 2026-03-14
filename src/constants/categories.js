// Varsayılan kategori tanımlamaları
// nameKey çeviri araması (translation lookup) için kullanılır
export const DEFAULT_CATEGORIES = [
  { id: 'yemek', name: 'Yemek', nameKey: 'food', icon: 'restaurant', iconLib: 'MaterialIcons', color: '#EF4444', isCustom: false },
  { id: 'ulasim', name: 'Ulaşım', nameKey: 'transport', icon: 'directions-car', iconLib: 'MaterialIcons', color: '#3B82F6', isCustom: false },
  { id: 'eglence', name: 'Eğlence', nameKey: 'entertainment', icon: 'movie', iconLib: 'MaterialIcons', color: '#F59E0B', isCustom: false },
  { id: 'faturalar', name: 'Faturalar', nameKey: 'bills', icon: 'receipt', iconLib: 'MaterialIcons', color: '#10B981', isCustom: false },
  { id: 'alisveris', name: 'Alışveriş', nameKey: 'shopping', icon: 'shopping-bag', iconLib: 'MaterialIcons', color: '#8B5CF6', isCustom: false },
  { id: 'saglik', name: 'Sağlık', nameKey: 'health', icon: 'local-hospital', iconLib: 'MaterialIcons', color: '#EC4899', isCustom: false },
  { id: 'spor', name: 'Spor', nameKey: 'sports', icon: 'fitness-center', iconLib: 'MaterialIcons', color: '#14B8A6', isCustom: false },
  { id: 'egitim', name: 'Eğitim', nameKey: 'education', icon: 'school', iconLib: 'MaterialIcons', color: '#6366F1', isCustom: false },
  { id: 'kafe', name: 'Kafe', nameKey: 'cafe', icon: 'local-cafe', iconLib: 'MaterialIcons', color: '#F97316', isCustom: false },
];

// İkonlar ve renkler havuzu
export const ICON_OPTIONS = [
  'local-hospital', 'fitness-center', 'school', 'work', 'home',
  'pets', 'child-care', 'spa', 'local-cafe', 'local-bar',
  'fastfood', 'local-pizza', 'cake', 'local-florist', 'brush'
];

export const COLOR_OPTIONS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

// Geriye uyumluluk için
export const CATEGORIES = DEFAULT_CATEGORIES;

// İşlem tipleri
export const TRANSACTION_TYPES = {
  INCOME: 'gelir',
  EXPENSE: 'gider',
};
