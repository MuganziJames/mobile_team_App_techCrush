import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface NoteEditorProps {
  visible: boolean;
  initialNote?: string;
  styleTitle: string;
  onSave: (note: string) => void;
  onCancel: () => void;
}

export default function NoteEditor({
  visible,
  initialNote = '',
  styleTitle,
  onSave,
  onCancel
}: NoteEditorProps) {
  const [note, setNote] = useState(initialNote);

  const handleSave = () => {
    onSave(note.trim());
  };

  const handleCancel = () => {
    if (note.trim() !== initialNote.trim()) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive', 
            onPress: () => {
              setNote(initialNote);
              onCancel();
            }
          }
        ]
      );
    } else {
      onCancel();
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Note',
      'Are you sure you want to clear this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => setNote('')
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.title} numberOfLines={1}>
              Add Note
            </Text>
            
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.styleInfo}>
              <Ionicons name="bookmark" size={20} color="#FF6B35" />
              <Text style={styles.styleTitle} numberOfLines={2}>
                {styleTitle}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Notes</Text>
              <TextInput
                style={styles.textInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add your thoughts, styling ideas, or reminders..."
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
                autoFocus
              />
              
              <View style={styles.inputFooter}>
                <Text style={styles.characterCount}>
                  {note.length}/500
                </Text>
                {note.length > 0 && (
                  <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Ionicons name="trash-outline" size={16} color="#FF6B35" />
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.tips}>
              <Text style={styles.tipsTitle}>💡 Tips:</Text>
              <Text style={styles.tipText}>• Note styling ideas or occasions</Text>
              <Text style={styles.tipText}>• Add color combinations you like</Text>
              <Text style={styles.tipText}>• Remember where you saw this style</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: 60,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  saveText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  styleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  styleTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    minHeight: 120,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearText: {
    fontSize: 12,
    color: '#FF6B35',
    marginLeft: 4,
  },
  tips: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
}); 