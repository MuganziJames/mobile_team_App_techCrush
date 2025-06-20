import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ProfileEditModalProps {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export default function ProfileEditModal({
  visible,
  title,
  placeholder,
  initialValue,
  onSave,
  onCancel,
}: ProfileEditModalProps) {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBar} />
            <View style={styles.iconContainer}>
              <Ionicons name="create" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Edit {title}</Text>
            <Text style={styles.subtitle}>Update your {title.toLowerCase()}</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>{title}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                placeholderTextColor="#999"
                autoFocus
                multiline={title === 'Bio'}
                numberOfLines={title === 'Bio' ? 3 : 1}
              />
              <View style={styles.inputBorder} />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={16} color={Colors.darkGray} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !value.trim() && styles.saveButtonDisabled
              ]}
              onPress={handleSave}
              disabled={!value.trim()}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark" size={16} color={Colors.white} />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom decoration */}
          <View style={styles.bottomDecor}>
            <View style={styles.decorLine} />
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
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
    minHeight: 300,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: `${Colors.primary}30`,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: Colors.black,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
  },
  inputBorder: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGray,
    marginLeft: 8,
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.midGray,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginLeft: 8,
  },
  bottomDecor: {
    alignItems: 'center',
    marginTop: 24,
  },
  decorLine: {
    width: 60,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 1.5,
  },
}); 