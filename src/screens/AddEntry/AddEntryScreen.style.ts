import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // ── Camera ──
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraTopBar: {
    paddingTop: Platform.OS === 'ios' ? 56 : 20,
    paddingHorizontal: 16,
  },
  cameraBackBtn: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cameraActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cameraActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  // ── Idle / Header ──
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  // ── Permissions ──
  permissionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  permissionLabel: {
    flex: 1,
    fontSize: 14,
  },
  permissionStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  // ── Preview ──
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    marginBottom: 16,
  },
  addressCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 15,
    lineHeight: 22,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationLoadingText: {
    fontSize: 14,
  },
  retryLocationBtn: {
    marginTop: 6,
  },
  // ── Actions ──
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  hint: {
    marginTop: 16,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
