import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';

import { useEntries } from '@/context/EntriesContext';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { TravelEntry } from '@/types';
import { styles } from './AddEntryScreen.style';


type ScreenState = 'idle' | 'camera' | 'preview';

export default function AddEntryScreen() {
  const { addEntry } = useEntries();
  const { isDark, theme } = useTheme();
  const colors = Colors[theme];

  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraType>('back');

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  const cameraRef = useRef<CameraView>(null);

  // Reset screen state when navigating back to this tab
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup when leaving screen — do NOT reset here (would reset on navigate away without save)
      };
    }, [])
  );

  // Request location and notification permissions on mount
  useEffect(() => {
    (async () => {
      const locPerm = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locPerm.status);

    })();
  }, []);

  const resetForm = useCallback(() => {
    setCapturedImageUri(null);
    setAddress(null);
    setLocationCoords(null);
    setScreenState('idle');
  }, []);

  // Reset when leaving tab (navigating to Home without saving)
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!isSaving) {
          resetForm();
        }
      };
    }, [isSaving, resetForm])
  );

  const fetchAddress = useCallback(async () => {
    if (locationPermission !== Location.PermissionStatus.GRANTED) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permission in your device settings to automatically get your address.'
        );
        setAddress('Address unavailable (no location permission)');
        return;
      }
    }

    setIsFetchingLocation(true);
    setAddress(null);
    setLocationCoords(null);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setLocationCoords({ latitude, longitude });

      const results = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (results && results.length > 0) {
        const place = results[0];
        const parts = [
          place.streetNumber,
          place.street,
          place.district,
          place.city,
          place.region,
          place.country,
        ].filter(Boolean);

        const formattedAddress = parts.join(', ') || 'Unknown Location';
        setAddress(formattedAddress);
      } else {
        setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Could not retrieve your current location. Please try again.');
      setAddress(null);
      setLocationCoords(null);
    } finally {
      setIsFetchingLocation(false);
    }
  }, [locationPermission]);

  const handleOpenCamera = useCallback(async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to take photos for your travel diary.'
        );
        return;
      }
    }
    setScreenState('camera');
  }, [cameraPermission, requestCameraPermission]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
        return;
      }

      setCapturedImageUri(photo.uri);
      setScreenState('preview');
      await fetchAddress();
    } catch (error) {
      console.error('Camera capture error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  }, [fetchAddress]);

  const handleRetake = useCallback(() => {
    setCapturedImageUri(null);
    setAddress(null);
    setLocationCoords(null);
    setScreenState('camera');
  }, []);


  const handleSave = useCallback(async () => {
    if (!capturedImageUri) {
      Alert.alert('No Photo', 'Please take a photo before saving your travel entry.');
      return;
    }

    if (isFetchingLocation) {
      Alert.alert('Please Wait', 'Location is still being fetched. Please wait a moment.');
      return;
    }

    if (!address || !locationCoords) {
      Alert.alert(
        'Location Required',
        'Unable to get your location. Would you like to save without an address?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save Anyway',
            onPress: () => performSave('Location unavailable', { latitude: 0, longitude: 0 }),
          },
        ]
      );
      return;
    }

    await performSave(address, locationCoords);
  }, [capturedImageUri, isFetchingLocation, address, locationCoords]);

  const performSave = async (
    resolvedAddress: string,
    coords: { latitude: number; longitude: number }
  ) => {
    if (!capturedImageUri) return;
    setIsSaving(true);

    try {
      const newEntry: TravelEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        imageUri: capturedImageUri,
        address: resolvedAddress,
        latitude: coords.latitude,
        longitude: coords.longitude,
        createdAt: new Date().toISOString(),
      };

      await addEntry(newEntry);

      resetForm();
      Alert.alert('Saved!', 'Your travel entry has been added to your diary.');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save your travel entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCameraFacing = useCallback(() => {
    setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }, []);

  // ── Camera view ──────────────────────────────────────────────────
  if (screenState === 'camera') {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing={cameraFacing}>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraBackBtn}
              onPress={() => setScreenState('idle')}
              accessibilityLabel="Go back"
            >
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureBtn}
              onPress={handleCapture}
              accessibilityLabel="Take photo"
            >
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraActionBtn}
              onPress={toggleCameraFacing}
              accessibilityLabel="Flip camera"
            >
              <Feather name="rotate-cw" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // ── Preview + Save view ──────────────────────────────────────────
  if (screenState === 'preview' && capturedImageUri) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preview</Text>

        <Image source={{ uri: capturedImageUri }} style={styles.previewImage} resizeMode="cover" />

        <View style={[styles.addressCard, { backgroundColor: isDark ? '#1E2022' : '#F5F5F5', borderColor: isDark ? '#2C2F33' : '#E0E0E0' }]}>
          <View style={styles.addressLabelRow}>
            <Feather name="map-pin" size={12} color={colors.icon} />
            <Text style={[styles.addressLabel, { color: colors.icon }]}>Location</Text>
          </View>
          {isFetchingLocation ? (
            <View style={styles.locationLoading}>
              <ActivityIndicator size="small" color={colors.tint} />
              <Text style={[styles.locationLoadingText, { color: colors.icon }]}>
                Getting your location...
              </Text>
            </View>
          ) : address ? (
            <Text style={[styles.addressText, { color: colors.text }]}>{address}</Text>
          ) : (
            <View>
              <Text style={[styles.addressText, { color: '#FF3B30' }]}>Location unavailable</Text>
              <TouchableOpacity onPress={fetchAddress} style={styles.retryLocationBtn}>
                <Text style={{ color: colors.tint, fontWeight: '600' }}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.previewActions}>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.tint }]}
            onPress={handleRetake}
            disabled={isSaving}
            accessibilityLabel="Retake photo"
          >
            <Text style={[styles.secondaryBtnText, { color: colors.tint }]}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.tint }, isSaving && styles.disabledBtn]}
            onPress={handleSave}
            disabled={isSaving || isFetchingLocation}
            accessibilityLabel="Save travel entry"
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={[styles.primaryBtnText, { color: isDark ? '#000000' : '#FFFFFF' }]}>Save Entry</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── Idle / initial view ──────────────────────────────────────────
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Feather name="camera" size={52} color={colors.tint} style={{ marginBottom: 12 }} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Travel Entry</Text>
        <Text style={[styles.headerSubtitle, { color: colors.icon }]}>
          Take a photo to capture your travel memory. Your current location will be automatically
          detected.
        </Text>
      </View>

      {/* Permission status indicators */}
      <View style={[styles.permissionCard, { backgroundColor: isDark ? '#1E2022' : '#F5F5F5', borderColor: isDark ? '#2C2F33' : '#E0E0E0' }]}>
        <Text style={[styles.permissionTitle, { color: colors.text }]}>Permissions</Text>
        <PermissionRow
          label="Camera"
          granted={cameraPermission?.granted ?? false}
          colors={colors}
        />
        <PermissionRow
          label="Location"
          granted={locationPermission === Location.PermissionStatus.GRANTED}
          colors={colors}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.tint }]}
        onPress={handleOpenCamera}
        accessibilityLabel="Open camera to take a photo"
        accessibilityRole="button"
      >
        <Text style={[styles.primaryBtnText, { color: isDark ? '#000000' : '#FFFFFF' }]}>Open Camera</Text>
      </TouchableOpacity>

      <Text style={[styles.hint, { color: colors.icon }]}>
        After taking a photo, your address will be automatically detected using your device's GPS.
      </Text>
    </ScrollView>
  );
}

function PermissionRow({
  label,
  granted,
  colors,
}: {
  label: string;
  granted: boolean;
  colors: { text: string; icon: string };
}) {
  return (
    <View style={styles.permissionRow}>
      <Text style={{ fontSize: 16 }}>{granted ? '✅' : '❌'}</Text>
      <Text style={[styles.permissionLabel, { color: colors.text }]}>{label}</Text>
      <Text style={[styles.permissionStatus, { color: granted ? '#34C759' : '#FF3B30' }]}>
        {granted ? 'Granted' : 'Not granted'}
      </Text>
    </View>
  );
}
