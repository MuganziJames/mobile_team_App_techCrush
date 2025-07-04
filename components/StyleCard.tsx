import { Style } from '@/contexts/LookbookContext';
import { getOutfitIdFromStyleId, isOutfitStyle } from '@/utils/outfitAdapter';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Dimensions,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Import fallback image at the top to avoid require resolution issues
const fallbackImage = require('../assets/images/modernAfrican.jpg');

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

// Helper function to handle image sources
const getImageSource = (image: string | ImageSourcePropType): ImageSourcePropType => {
  if (typeof image === 'string') {
    // If it's a string and not empty, use it as URI
    if (image && image.trim() !== '') {
      return { uri: image };
    } else {
      // Fallback to a default image when no image URL is provided
      return fallbackImage;
    }
  }
  // If it's already an ImageSourcePropType (local require), use it as is
  return image;
};

interface StyleCardProps {
  style: Style;
  onSave?: (style: Style) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
  onPress?: (style: Style) => void;
}

export default function StyleCard({ 
  style, 
  onSave, 
  isSaved = false, 
  showSaveButton = true,
  onPress 
}: StyleCardProps) {
  
  const handlePress = () => {
    if (onPress) {
      onPress(style);
    } else {
      // Check if this is an outfit-based style and get the original outfit ID
      if (isOutfitStyle(style.id)) {
        const outfitId = getOutfitIdFromStyleId(style.id);
        if (outfitId) {
          router.push({
            pathname: '/style-detail',
            params: { id: outfitId }
          });
        } else {
          console.error('Could not find outfit ID for style:', style.id);
          // Don't navigate if we can't find the proper outfit ID
        }
      } else {
        // For non-outfit styles, use the style ID directly
        router.push({
          pathname: '/style-detail',
          params: { id: style.id.toString() }
        });
      }
    }
  };

  const handleSave = (e: any) => {
    e.stopPropagation();
    if (onSave) {
      onSave(style);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={getImageSource(style.image)} style={styles.image} />
        {showSaveButton && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={isSaved ? "#FF6B35" : "#FFFFFF"} 
              style={styles.saveIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {style.title}
        </Text>
        <Text style={styles.category}>
          {style.category}
        </Text>
        
        <View style={styles.tagsContainer}>
          {style.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {style.tags.length > 2 && (
            <Text style={styles.moreText}>+{style.tags.length - 2}</Text>
          )}
        </View>
        
        <View style={styles.colorIndicator}>
          <View 
            style={[
              styles.colorDot, 
              { backgroundColor: style.color }
            ]} 
          />
          <Text style={styles.colorText}>{style.color}</Text>
        </View>
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
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: cardWidth * 1.2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'cover',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 14,
    position: 'relative',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    lineHeight: 20,
  },
  category: {
    fontSize: 11,
    color: '#FF6B35',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  tagText: {
    fontSize: 10,
    color: '#FF6B35',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  colorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  colorText: {
    fontSize: 11,
    color: '#555',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  saveIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
}); 