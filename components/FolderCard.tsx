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
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: cardWidth * 0.8,
  },
  imageGrid: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
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
  },
  topRow: {
    flexDirection: 'row',
    height: '50%',
  },
  bottomRow: {
    flexDirection: 'row',
    height: '50%',
  },
  quarterImage: {
    width: '50%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyQuarter: {
    backgroundColor: '#f0f0f0',
  },
  emptyFolder: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  count: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
}); 