import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalCardProps {
  visible: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconBackground?: string;
  title: string;
  message?: string;
  content?: ReactNode;
  primaryLabel?: string;
  onClose: () => void;
}

export default function ModalCard({
  visible,
  iconName,
  iconBackground = Colors.primary,
  title,
  message,
  content,
  primaryLabel = 'OK',
  onClose,
}: ModalCardProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {iconName && (
            <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
              <Ionicons name={iconName} size={32} color={Colors.white} />
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
          {content}
          <TouchableOpacity style={styles.primaryButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.4,
    shadowRadius: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
}); 