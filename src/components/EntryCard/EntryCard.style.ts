import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hidden: {
    opacity: 0,
    position: 'absolute',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  address: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  removeButton: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
