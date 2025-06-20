import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          {/* Decorative top gradient bar */}
          <View style={[styles.topBar, { backgroundColor: iconBackground }]} />
          
          {iconName && (
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: iconBackground }]}>
                <Ionicons name={iconName} size={28} color={Colors.white} />
              </View>
              {/* Decorative ring around icon */}
              <View style={[styles.iconRing, { borderColor: iconBackground }]} />
            </View>
          )}
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            {message && (
              <View style={styles.messageContainer}>
                <Text style={styles.message}>{message}</Text>
              </View>
            )}
            {content}
          </View>
          
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: iconBackground }]} 
            onPress={onClose} 
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} style={styles.buttonIcon} />
          </TouchableOpacity>
          
          {/* Bottom decorative element */}
          <View style={styles.bottomDecoration}>
            <View style={[styles.decorativeDot, { backgroundColor: iconBackground }]} />
            <View style={[styles.decorativeDot, { backgroundColor: iconBackground, opacity: 0.6 }]} />
            <View style={[styles.decorativeDot, { backgroundColor: iconBackground, opacity: 0.3 }]} />
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
  topBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginBottom: 24,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  message: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'center',
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
  buttonIcon: {
    marginLeft: 8,
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  decorativeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
}); 