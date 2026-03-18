import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEntries } from '@/context/EntriesContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import EntryCard from '@/components/EntryCard/EntryCard';
import { TravelEntry } from '@/types';
import { styles } from './HomeScreen.style';

export default function HomeScreen() {
  const { entries, removeEntry, isLoading } = useEntries();
  const { isDark, theme } = useTheme();
  const colors = Colors[theme];

  const handleRemove = useCallback(
    async (id: string) => {
      try {
        await removeEntry(id);
      } catch (error) {
        Alert.alert('Error', 'Failed to remove entry. Please try again.');
      }
    },
    [removeEntry]
  );

  const renderItem = useCallback(
    ({ item }: { item: TravelEntry }) => (
      <EntryCard entry={item} onRemove={handleRemove} />
    ),
    [handleRemove]
  );

  const keyExtractor = useCallback((item: TravelEntry) => item.id, []);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.icon }]}>Loading entries...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={entries.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Entries Yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
              Tap the "Add Entry" tab to capture your first travel memory!
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
