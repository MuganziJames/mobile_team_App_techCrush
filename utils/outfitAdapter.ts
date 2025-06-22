import { Outfit } from '@/api/types';
import { Style } from '@/contexts/LookbookContext';

// ID mapping storage
const idMapping: { [styleId: number]: string } = {};
const reverseIdMapping: { [outfitId: string]: number } = {};

// Color palette for categories (since API outfits don't have colors)
const categoryColors: { [key: string]: string } = {
  'Office': '#2F4F4F',
  'Traditional': '#8B4513',
  'Ankara': '#FF6B35',
  'Casual': '#4ECDC4',
  'Evening': '#8B0000',
  'Formal': '#2F2F2F',
  'Street': '#696969',
  'Bohemian': '#DEB887',
  'Romantic': '#FFB6C1',
  'Sport': '#FF6347',
  'Vintage': '#8B4513',
  'Modern': '#F5F5F5',
  'Business': '#2F4F4F',
  'Resort': '#00CED1',
  'Gothic': '#2F2F2F',
  'Punk': '#8B0000',
  'Preppy': '#8B4513',
  'default': '#FF6B35'
};

// Helper function to convert string to hash code (for ID conversion)
declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Convert outfit to style format
export function outfitToStyle(outfit: Outfit): Style {
  // Use first image from array, with better fallback handling
  let imageUrl = '';
  
  if (outfit.imageUrls && outfit.imageUrls.length > 0) {
    // Use the first image from the array
    imageUrl = outfit.imageUrls[0];
    
    // Debug log to verify first image selection
    if (outfit.imageUrls.length > 1) {
      console.log(`Outfit "${outfit.title}" has ${outfit.imageUrls.length} images, using first: ${imageUrl}`);
    }
  } else {
    console.log(`Outfit "${outfit.title}" has no images, will use fallback`);
  }
  
  // Generate tags from category and description
  const tags: string[] = [];
  
  // Add category as tag
  if (outfit.category?.name) {
    tags.push(outfit.category.name.toLowerCase());
  }
  
  // Extract keywords from description
  const description = outfit.description.toLowerCase();
  const keywords = [
    'african', 'ankara', 'kente', 'dashiki', 'traditional', 'modern',
    'elegant', 'casual', 'formal', 'professional', 'vintage', 'bohemian',
    'romantic', 'sporty', 'colorful', 'vibrant', 'comfortable', 'stylish',
    'chic', 'trendy', 'classic', 'contemporary', 'artistic', 'cultural'
  ];
  
  keywords.forEach(keyword => {
    if (description.includes(keyword) && !tags.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  // Ensure we have at least 2 tags
  if (tags.length === 0) {
    tags.push('style', 'fashion');
  } else if (tags.length === 1) {
    tags.push('fashion');
  }
  
  // Get color for category
  const categoryName = outfit.category?.name || 'default';
  const color = categoryColors[categoryName] || categoryColors.default;
  
  // Convert UUID to number for compatibility
  const styleId = outfit.id.hashCode();
  
  // Store the mapping
  idMapping[styleId] = outfit.id;
  reverseIdMapping[outfit.id] = styleId;
  
  console.log(`Created mapping: styleId ${styleId} -> outfitId ${outfit.id}`);
  
  return {
    id: styleId,
    title: outfit.title,
    image: imageUrl, // This will be the first image from imageUrls array or empty string
    category: outfit.category?.name || 'Style',
    tags: tags.slice(0, 5), // Limit to 5 tags
    color: color,
    description: outfit.description
  };
}

// Convert multiple outfits to styles
export function outfitsToStyles(outfits: Outfit[]): Style[] {
  return outfits.map(outfitToStyle);
}

// Get outfit ID from style ID
export function getOutfitIdFromStyleId(styleId: number): string | undefined {
  const outfitId = idMapping[styleId];
  if (!outfitId) {
    console.error('No outfit ID found for style ID:', styleId);
    console.log('Available mappings:', Object.keys(idMapping));
  }
  return outfitId;
}

// Get style ID from outfit ID
export function getStyleIdFromOutfitId(outfitId: string): number | undefined {
  const styleId = reverseIdMapping[outfitId];
  if (!styleId) {
    console.error('No style ID found for outfit ID:', outfitId);
  }
  return styleId;
}

// Check if style ID corresponds to an outfit
export function isOutfitStyle(styleId: number): boolean {
  const exists = styleId in idMapping;
  if (!exists) {
    console.warn('Style ID not found in outfit mapping:', styleId);
  }
  return exists;
} 