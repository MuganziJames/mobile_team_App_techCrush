import FolderCard from '@/components/FolderCard';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EmptyState from '@/components/ui/EmptyState';
import ErrorCard from '@/components/ui/ErrorCard';
import SuccessCard from '@/components/ui/SuccessCard';
import { useLookbook } from '@/contexts/LookbookContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const folderColors = ['#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

export default function LookbookScreen() {
  const { 
    folders, 
    getStylesInFolder, 
    createFolder, 
    deleteFolder,
    loading,
    error,
    refreshFolders
  } = useLookbook();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(folderColors[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [showErrorCard, setShowErrorCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', message: '' });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleFolderPress = (folder: any) => {
    router.push({
      pathname: '/lookbook-folder',
      params: { 
        folderId: folder.id,
        folderName: folder.name,
        folderColor: folder.color
      }
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      setFolderToDelete({ id: folderId, name: folder.name });
      setShowDeleteConfirmation(true);
    }
  };

  const confirmDeleteFolder = async () => {
    if (folderToDelete) {
      const result = await deleteFolder(folderToDelete.id);
      setShowDeleteConfirmation(false);
      
      if (result.success) {
        setSuccessMessage({
          title: 'Lookbook Deleted!',
          message: `"${folderToDelete.name}" has been deleted successfully.`
        });
        setShowSuccessCard(true);
      } else {
        setErrorMessage({
          title: 'Delete Failed',
          message: result.error || 'Failed to delete lookbook. Please try again.'
        });
        setShowErrorCard(true);
      }
      
      setFolderToDelete(null);
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      const result = await createFolder(newFolderName.trim(), selectedColor);
      if (result.success) {
        setNewFolderName('');
        setSelectedColor(folderColors[0]);
        setShowCreateModal(false);
        setSuccessMessage({
          title: 'Lookbook Created!',
          message: `"${result.folderName}" has been created successfully.`
        });
        setShowSuccessCard(true);
      } else {
        setShowCreateModal(false);
        setErrorMessage({
          title: 'Creation Failed',
          message: result.error || 'Failed to create lookbook. Please try again.'
        });
        setShowErrorCard(true);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshFolders();
    setRefreshing(false);
  };

  const renderContent = () => {
    if (loading && folders.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading your lookbooks...</Text>
        </View>
      );
    }

    if (error && folders.length === 0) {
      return (
        <EmptyState
          icon="alert-circle-outline"
          title="Error Loading Lookbooks"
          description={error}
          actionText="Try Again"
          onActionPress={refreshFolders}
        />
      );
    }

    if (folders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No Lookbooks Yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first lookbook to start organizing your saved styles
          </Text>
          <TouchableOpacity 
            style={styles.createFirstButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createFirstButtonText}>Create Lookbook</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.foldersContainer}>
        {folders.map((folder, index) => {
          const folderStyles = getStylesInFolder(folder.id);
          return (
            <View key={folder.id} style={[
              styles.folderWrapper,
              index % 2 === 0 ? styles.leftFolder : styles.rightFolder
            ]}>
              <FolderCard
                folder={folder}
                styles={folderStyles}
                onPress={handleFolderPress}
                onDelete={handleDeleteFolder}
              />
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <SuccessCard
        visible={showSuccessCard}
        title={successMessage.title}
        message={successMessage.message}
        onClose={() => setShowSuccessCard(false)}
      />

      <ErrorCard
        visible={showErrorCard}
        title={errorMessage.title}
        message={errorMessage.message}
        onClose={() => setShowErrorCard(false)}
      />

      <ConfirmationModal
        visible={showDeleteConfirmation}
        iconName="trash"
        iconBackground="#FF3B30"
        title="Delete Lookbook"
        message={`Are you sure you want to delete "${folderToDelete?.name}"? All styles in this lookbook will be removed.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteFolder}
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setFolderToDelete(null);
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Lookbooks</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {!loading && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {folders.length} lookbook{folders.length !== 1 ? 's' : ''} • {' '}
              {folders.reduce((total, folder) => total + getStylesInFolder(folder.id).length, 0)} styles saved
            </Text>
          </View>
        )}

        {renderContent()}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowCreateModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Lookbook</Text>
            <TouchableOpacity 
              onPress={handleCreateFolder}
              style={styles.modalSaveButton}
              disabled={!newFolderName.trim()}
            >
              <Text style={[
                styles.modalSaveText,
                !newFolderName.trim() && styles.modalSaveTextDisabled
              ]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Lookbook Name</Text>
              <TextInput
                style={styles.textInput}
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="Enter lookbook name..."
                placeholderTextColor="#999"
                autoFocus
                maxLength={30}
              />
            </View>

            <View style={styles.colorSection}>
              <Text style={styles.inputLabel}>Choose Color</Text>
              <View style={styles.colorGrid}>
                {folderColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.inputLabel}>Preview</Text>
              <View style={styles.previewCard}>
                <View style={[styles.previewColor, { backgroundColor: selectedColor }]} />
                <Text style={styles.previewText}>
                  {newFolderName.trim() || 'Lookbook Name'}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  foldersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  folderWrapper: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  leftFolder: {
    paddingRight: 8,
  },
  rightFolder: {
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalSaveButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  modalSaveText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    textAlign: 'right',
  },
  modalSaveTextDisabled: {
    color: '#ccc',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  colorSection: {
    marginBottom: 32,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
  },
  previewSection: {
    marginBottom: 32,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
  },
  previewColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
}); 