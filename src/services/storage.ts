import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '@/types';

const STORAGE_KEY = 'travel_diary_entries';

export async function loadEntries(): Promise<TravelEntry[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as TravelEntry[];
  }
  return [];
}

export async function saveEntries(entries: TravelEntry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
