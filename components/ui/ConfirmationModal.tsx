import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface ConfirmationModalProps {
  visible: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBackground?: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  visible,
  iconName,
  iconBackground = Colors.primary,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const isDestructive = iconBackground === '#FF3B30' || iconName === 'trash';
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
            <Ionicons name={iconName} size={24} color="#FFFFFF" />
          </View>
          
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          
          {/* Message */}
          <Text style={styles.message}>{message}</Text>
          
          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.confirmButton, { backgroundColor: iconBackground }]} 
              onPress={onConfirm} 
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel} 
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
          </View>
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
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  confirmButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
}); 