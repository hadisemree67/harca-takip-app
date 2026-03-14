import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const SettingsScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  const SettingItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <MaterialIcons name={icon} size={24} color={colors.primary} />
        </View>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>
        <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const OptionModal = ({ title, options, selectedValue, onSelect }) => (
    <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionItem,
            selectedValue === option.value && {
              backgroundColor: colors.primary + '20',
            },
          ]}
          onPress={() => onSelect(option.value)}
        >
          <View style={styles.optionLeft}>
            <MaterialIcons name={option.icon} size={24} color={colors.text} />
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              {option.label}
            </Text>
          </View>
          {selectedValue === option.value && (
            <MaterialIcons name="check" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('settings')}
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {t('personalizeApp')}
        </Text>
      </View>

      {/* Tema Ayarı */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('appearance')}
        </Text>
        <View style={[styles.optionCard, { backgroundColor: colors.card }]}>
          <View style={styles.optionHeader}>
            <View style={styles.optionHeaderLeft}>
              <MaterialIcons
                name={isDark ? 'dark-mode' : 'light-mode'}
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {t('theme')}
              </Text>
            </View>
          </View>
          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                !isDark && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                { borderColor: colors.border },
              ]}
              onPress={() => !isDark || toggleTheme()}
            >
              <MaterialIcons
                name="light-mode"
                size={24}
                color={!isDark ? '#FFFFFF' : colors.text}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  { color: !isDark ? '#FFFFFF' : colors.text },
                ]}
              >
                {t('lightMode')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                isDark && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                { borderColor: colors.border },
              ]}
              onPress={() => isDark || toggleTheme()}
            >
              <MaterialIcons
                name="dark-mode"
                size={24}
                color={isDark ? '#FFFFFF' : colors.text}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  { color: isDark ? '#FFFFFF' : colors.text },
                ]}
              >
                {t('darkMode')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Dil Ayarı */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          DİL / LANGUAGE
        </Text>
        <View style={[styles.optionCard, { backgroundColor: colors.card }]}>
          <View style={styles.optionHeader}>
            <View style={styles.optionHeaderLeft}>
              <MaterialIcons name="language" size={24} color={colors.primary} />
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {t('language')}
              </Text>
            </View>
          </View>
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'tr' && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                { borderColor: colors.border },
              ]}
              onPress={() => changeLanguage('tr')}
            >
              <Text
                style={[
                  styles.languageFlag,
                  language === 'tr' && styles.selectedLanguageFlag,
                ]}
              >
                🇹🇷
              </Text>
              <Text
                style={[
                  styles.languageButtonText,
                  { color: language === 'tr' ? '#FFFFFF' : colors.text },
                ]}
              >
                Türkçe
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === 'en' && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                { borderColor: colors.border },
              ]}
              onPress={() => changeLanguage('en')}
            >
              <Text
                style={[
                  styles.languageFlag,
                  language === 'en' && styles.selectedLanguageFlag,
                ]}
              >
                🇬🇧
              </Text>
              <Text
                style={[
                  styles.languageButtonText,
                  { color: language === 'en' ? '#FFFFFF' : colors.text },
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={[styles.appInfo, { borderTopColor: colors.border }]}>
        <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
          HarcaTakip v1.0.0
        </Text>
        <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
          Mobil Programlama Proje Ödevi
        </Text>
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
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  optionCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  languageFlag: {
    fontSize: 24,
    opacity: 0.6,
  },
  selectedLanguageFlag: {
    opacity: 1,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginTop: 24,
    borderTopWidth: 1,
  },
  appInfoText: {
    fontSize: 12,
    marginBottom: 4,
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

export default SettingsScreen;
