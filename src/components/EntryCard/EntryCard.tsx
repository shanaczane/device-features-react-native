import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { TravelEntry } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { styles } from './EntryCard.style';

interface EntryCardProps {
  entry: TravelEntry;
  onRemove: (id: string) => void;
}

export default function EntryCard({ entry, onRemove }: EntryCardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);

  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleRemove = () => {
    Alert.alert(
      'Remove Entry',
      'Are you sure you want to remove this travel entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemove(entry.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1E2022' : '#FFFFFF', borderColor: isDark ? '#2C2F33' : '#E0E0E0' }]}>
      <View style={styles.imageContainer}>
        {imageLoading && !imageError && (
          <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? '#2C2F33' : '#F0F0F0' }]}>
            <ActivityIndicator color={colors.tint} />
          </View>
        )}
        {imageError ? (
          <View style={[styles.imagePlaceholder, { backgroundColor: isDark ? '#2C2F33' : '#F0F0F0' }]}>
            <Text style={{ color: colors.icon, fontSize: 12 }}>Image unavailable</Text>
          </View>
        ) : (
          <Image
            source={{ uri: entry.imageUri }}
            style={[styles.image, imageLoading && styles.hidden]}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.address, { color: colors.text }]} numberOfLines={2}>
          {entry.address}
        </Text>
        <Text style={[styles.date, { color: colors.icon }]}>{formattedDate}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemove}
        accessibilityLabel="Remove travel entry"
        accessibilityRole="button"
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}
