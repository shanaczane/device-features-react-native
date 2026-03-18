import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab/HapticTab';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { isDark, toggleTheme, theme } = useTheme();
  const colors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: isDark ? '#151718' : '#FFFFFF',
          borderTopColor: isDark ? '#2C2F33' : '#E0E0E0',
        },
        headerStyle: {
          backgroundColor: isDark ? '#151718' : '#FFFFFF',
        },
        headerTintColor: colors.text,
        headerShown: true,
        tabBarButton: HapticTab,
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeToggle}
            accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            accessibilityRole="button"
          >
            <Feather name={isDark ? 'sun' : 'moon'} size={20} color={colors.text} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Travel Diary',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="add-entry"
        options={{
          title: 'Add Entry',
          tabBarIcon: ({ color }) => <Feather name="plus-circle" size={24} color={color} />,
          tabBarLabel: 'Add Entry',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    marginRight: 16,
    padding: 4,
  },
});
