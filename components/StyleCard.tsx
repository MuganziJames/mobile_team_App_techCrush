import { Style } from '@/contexts/LookbookContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

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
      router.push({
        pathname: '/style-detail',
        params: { id: style.id }
      });
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
        <Image source={{ uri: style.image }} style={styles.image} />
        {showSaveButton && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={isSaved ? "#FF6B35" : "#fff"} 
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
  },
  image: {
    width: '100%',
    height: cardWidth * 1.2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 18,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  moreText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  colorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorText: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
  },
}); 