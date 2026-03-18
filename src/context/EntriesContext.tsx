import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TravelEntry } from '@/types';
import { loadEntries, saveEntries } from '@/services/storage';

interface EntriesContextType {
  entries: TravelEntry[];
  addEntry: (entry: TravelEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  isLoading: boolean;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries()
      .then(setEntries)
      .catch((error) => console.error('Failed to load entries from storage:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const addEntry = useCallback(async (entry: TravelEntry) => {
    const updatedEntries = [entry, ...entries];
    try {
      await saveEntries(updatedEntries);
      setEntries(updatedEntries);
    } catch {
      throw new Error('Failed to save entry. Please try again.');
    }
  }, [entries]);

  const removeEntry = useCallback(async (id: string) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid entry ID.');
    }
    const updatedEntries = entries.filter((e) => e.id !== id);
    try {
      await saveEntries(updatedEntries);
      setEntries(updatedEntries);
    } catch {
      throw new Error('Failed to remove entry. Please try again.');
    }
  }, [entries]);

  return (
    <EntriesContext.Provider value={{ entries, addEntry, removeEntry, isLoading }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries(): EntriesContextType {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
}
