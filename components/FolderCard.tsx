import { LookbookFolder, SavedStyle } from '@/contexts/LookbookContext';
import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface FolderCardProps {
  folder: LookbookFolder;
  styles: SavedStyle[];
  onPress: (folder: LookbookFolder) => void;
  onDelete?: (folderId: string) => void;
  showDeleteButton?: boolean;
}

export default function FolderCard({ 
  folder, 
  styles: folderStyles, 
  onPress, 
  onDelete,
  showDeleteButton = true 
}: FolderCardProps) {
  
  const handlePress = () => {
    onPress(folder);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    if (onDelete && folder.id !== 'favorites' && folder.id !== 'inspiration') {
      onDelete(folder.id);
    }
  };

  const previewImages = folderStyles.slice(0, 4);
  const canDelete = showDeleteButton && folder.id !== 'favorites' && folder.id !== 'inspiration';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {previewImages.length > 0 ? (
          <View style={styles.imageGrid}>
            {previewImages.length === 1 ? (
              <Image 
                source={{ uri: previewImages[0].image }} 
                style={styles.singleImage} 
              />
            ) : previewImages.length === 2 ? (
              <>
                <Image 
                  source={{ uri: previewImages[0].image }} 
                  style={styles.halfImage} 
                />
                <Image 
                  source={{ uri: previewImages[1].image }} 
                  style={styles.halfImage} 
                />
              </>
            ) : (
              <>
                <View style={styles.topRow}>
                  <Image 
                    source={{ uri: previewImages[0].image }} 
                    style={styles.quarterImage} 
                  />
                  <Image 
                    source={{ uri: previewImages[1].image }} 
                    style={styles.quarterImage} 
                  />
                </View>
                <View style={styles.bottomRow}>
                  <Image 
                    source={{ uri: previewImages[2].image }} 
                    style={styles.quarterImage} 
                  />
                  {previewImages[3] ? (
                    <Image 
                      source={{ uri: previewImages[3].image }} 
                      style={styles.quarterImage} 
                    />
                  ) : (
                    <View style={[styles.quarterImage, styles.emptyQuarter]} />
                  )}
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={[styles.emptyFolder, { backgroundColor: folder.color + '20' }]}>
            <Ionicons name="folder-outline" size={40} color={folder.color} />
          </View>
        )}
        
        {canDelete && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View 
            style={[styles.colorIndicator, { backgroundColor: folder.color }]} 
          />
          <Text style={styles.title} numberOfLines={1}>
            {folder.name}
          </Text>
        </View>
        
        <Text style={styles.count}>
          {folderStyles.length} style{folderStyles.length !== 1 ? 's' : ''}
        </Text>
        
        <Text style={styles.date}>
          Created {new Date(folder.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: cardWidth * 0.8,
    backgroundColor: '#f8f8f8',
  },
  imageGrid: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  singleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  halfImage: {
    width: '50%',
    height: '100%',
    resizeMode: 'cover',
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  topRow: {
    flexDirection: 'row',
    height: '50%',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomRow: {
    flexDirection: 'row',
    height: '50%',
  },
  quarterImage: {
    width: '50%',
    height: '100%',
    resizeMode: 'cover',
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emptyQuarter: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFolder: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    padding: 14,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    lineHeight: 20,
  },
  count: {
    fontSize: 12,
    color: '#FF6B35',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
}); 