import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { useLanguage } from '../context/LanguageContext';
import { TRANSACTION_TYPES, ICON_OPTIONS, COLOR_OPTIONS } from '../constants/categories';
import { formatDate } from '../utils/dateUtils';

const AddTransactionScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { addTransaction, updateTransaction, categories, addCategory, deleteCategory } = useTransactions();
  const { t } = useLanguage();

  const editingTransaction = route.params?.transaction;
  const isEditing = !!editingTransaction;

  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || '');
  const [category, setCategory] = useState(editingTransaction?.category || 'yemek');
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [date, setDate] = useState(editingTransaction ? new Date(editingTransaction.date) : new Date());
  const [type, setType] = useState(editingTransaction?.type || TRANSACTION_TYPES.EXPENSE);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryEmoji, setCategoryEmoji] = useState('📌');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [deleteMode, setDeleteMode] = useState(false);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert(t('error'), t('enterValidAmount'));
      return;
    }

    const transaction = {
      amount: parseFloat(amount),
      category,
      description,
      date: date.toISOString(),
      type,
    };

    if (isEditing) {
      await updateTransaction(editingTransaction.id, transaction);
      Alert.alert(t('success'), t('transactionUpdated'), [
        { text: t('ok'), onPress: () => navigation.goBack() },
      ]);
    } else {
      await addTransaction(transaction);
      Alert.alert(t('success'), t('transactionSaved'), [
        { text: t('ok'), onPress: () => navigation.goBack() },
      ]);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert(t('error'), t('enterCategoryName'));
      return;
    }
    if (!categoryEmoji.trim()) {
      Alert.alert(t('error'), t('enterEmoji'));
      return;
    }
    await addCategory({
      name: newCategoryName,
      icon: categoryEmoji,
      color: selectedColor,
      iconLib: 'emoji',
    });
    setShowAddCategory(false);
    setNewCategoryName('');
    setCategoryEmoji('📌');
    Alert.alert(t('success'), t('categorySaved'));
  };

  const handleDeleteCategory = (categoryId, categoryName) => {
    Alert.alert(
      t('delete'),
      t('deleteCategoryConfirm', { category: categoryName }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteCategory(categoryId);
            if (category === categoryId) {
              setCategory(categories[0]?.id || 'yemek');
            }
            Alert.alert(t('success'), t('categoryDeleted'));
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tip Seçici */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor:
                type === TRANSACTION_TYPES.EXPENSE ? colors.expense : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setType(TRANSACTION_TYPES.EXPENSE)}
        >
          <Text
            style={[
              styles.typeText,
              {
                color:
                  type === TRANSACTION_TYPES.EXPENSE ? '#FFFFFF' : colors.text,
              },
            ]}
          >
            {t('expense')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor:
                type === TRANSACTION_TYPES.INCOME ? colors.income : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setType(TRANSACTION_TYPES.INCOME)}
        >
          <Text
            style={[
              styles.typeText,
              {
                color: type === TRANSACTION_TYPES.INCOME ? '#FFFFFF' : colors.text,
              },
            ]}
          >
            {t('income')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tutar */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>{t('amount')} ({t('currencySymbol')})</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder={t('amountPlaceholder')}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Kategori (sadece gider için) */}
      {type === TRANSACTION_TYPES.EXPENSE && (
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: colors.text }]}>{t('category')}</Text>
            <View style={styles.categoryActions}>
              <TouchableOpacity
                onPress={() => setDeleteMode(!deleteMode)}
                style={[styles.actionButton, deleteMode && { backgroundColor: colors.expense + '20' }]}
              >
                <MaterialIcons
                  name={deleteMode ? "close" : "remove-circle-outline"}
                  size={24}
                  color={deleteMode ? colors.expense : colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAddCategory(!showAddCategory)}>
                <MaterialIcons name="add-circle-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {showAddCategory && (
            <View style={[styles.addCategoryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, marginBottom: 12 }]}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder={t('categoryName')}
                placeholderTextColor={colors.textSecondary}
              />
              <View style={styles.emojiColorRow}>
                <View style={styles.emojiPicker}>
                  <Text style={[styles.smallLabel, { color: colors.textSecondary }]}>{t('emoji')}:</Text>
                  <TextInput
                    style={[styles.emojiInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    value={categoryEmoji}
                    onChangeText={setCategoryEmoji}
                    placeholder="🎨"
                    maxLength={2}
                  />
                  <Text style={[styles.emojiHint, { color: colors.textSecondary }]}>
                    {t('selectEmojiFromKeyboard')}
                  </Text>
                </View>
                <View style={styles.colorPicker}>
                  <Text style={[styles.smallLabel, { color: colors.textSecondary }]}>{t('color')}:</Text>
                  <View style={styles.colorOptions}>
                    {COLOR_OPTIONS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        style={[styles.colorOption, { backgroundColor: color, borderWidth: selectedColor === color ? 3 : 0, borderColor: '#FFF' }]}
                      />
                    ))}
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.addCategoryBtn, { backgroundColor: colors.primary }]} onPress={handleAddCategory}>
                <Text style={styles.addCategoryBtnText}>{t('addCategory')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: category === cat.id ? cat.color : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  if (deleteMode && cat.isCustom) {
                    handleDeleteCategory(cat.id, cat.name);
                  } else if (!deleteMode) {
                    setCategory(cat.id);
                  }
                }}
                onLongPress={() => {
                  if (cat.isCustom) {
                    handleDeleteCategory(cat.id, cat.name);
                  }
                }}
              >
                {deleteMode && cat.isCustom && (
                  <View style={styles.deleteIconBadge}>
                    <MaterialIcons name="cancel" size={20} color={colors.expense} />
                  </View>
                )}
                {cat.iconLib === 'MaterialIcons' || cat.iconLib === undefined ? (
                  <MaterialIcons
                    name={cat.icon}
                    size={32}
                    color={category === cat.id ? '#FFFFFF' : cat.color}
                  />
                ) : (
                  <Text style={[styles.categoryEmoji, { color: category === cat.id ? '#FFFFFF' : cat.color }]}>{cat.icon}</Text>
                )}
                <Text
                  style={[
                    styles.categoryName,
                    {
                      color: category === cat.id ? '#FFFFFF' : colors.text,
                    },
                  ]}
                >
                  {cat.nameKey ? t(cat.nameKey) : cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Açıklama */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('descriptionOptional')}
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder={t('descriptionPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Tarih */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>{t('date')}</Text>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: colors.card }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateText, { color: colors.text }]}>
            {formatDate(date)}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Kaydet/Güncelle Butonu */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          {isEditing ? t('update') : t('save')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
    borderRadius: 8,
  },
  addCategoryBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  emojiColorRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  emojiPicker: {
    flex: 1,
  },
  colorPicker: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  emojiInput: {
    fontSize: 32,
    textAlign: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  emojiHint: {
    fontSize: 10,
    textAlign: 'center',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  addCategoryBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addCategoryBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
  },
  deleteIconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    zIndex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  saveButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddTransactionScreen;
