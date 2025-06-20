import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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
          {/* Warning indicator for destructive actions */}
          {isDestructive && (
            <View style={styles.warningStripe} />
          )}
          
          {/* Header section */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
              <Ionicons name={iconName} size={32} color={Colors.white} />
            </View>
            
            {/* Pulse effect for destructive actions */}
            {isDestructive && (
              <View style={[styles.pulseRing, { borderColor: iconBackground }]} />
            )}
          </View>
          
          {/* Content section */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.messageBox}>
              <Text style={styles.message}>{message}</Text>
            </View>
          </View>
          
          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.confirmButton, 
                { backgroundColor: iconBackground },
                isDestructive && styles.destructiveButton
              ]} 
              onPress={onConfirm} 
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isDestructive ? "warning" : "checkmark"} 
                size={16} 
                color={Colors.white} 
                style={styles.buttonIcon} 
              />
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: iconBackground }]} 
              onPress={onCancel} 
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={16} color={iconBackground} style={styles.buttonIcon} />
              <Text style={[styles.cancelButtonText, { color: iconBackground }]}>{cancelLabel}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Bottom decoration */}
          <View style={styles.bottomDecor}>
            <View style={[styles.decorLine, { backgroundColor: iconBackground }]} />
          </View>
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
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexDirection: 'row',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    flexDirection: 'row',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  warningStripe: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF3B30',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginLeft: 12,
  },
  content: {
    alignItems: 'center',
  },
  messageBox: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonIcon: {
    marginRight: 8,
  },
  bottomDecor: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
  },
  decorLine: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
}); 