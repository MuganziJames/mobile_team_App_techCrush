import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

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
            <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
              <Ionicons name={iconName} size={24} color="#FFFFFF" />
            </View>
          )}
          
          <Text style={styles.title}>{title}</Text>
          
          {message && (
            <Text style={styles.message}>{message}</Text>
          )}
          
          {content}
          
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: iconBackground }]} 
            onPress={onClose} 
            activeOpacity={0.8}
          >
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  card: {
    width: Math.min(width - 40, 320),
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
    zIndex: 1001,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 