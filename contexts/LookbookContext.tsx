import LookbookService from '@/api/lookbook.service';
import { LookbookWithOutfits } from '@/api/types';
import { getOutfitIdFromStyleId, isOutfitStyle } from '@/utils/outfitAdapter';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

// Types
export interface Style {
  id: number;
  title: string;
  image: string | ImageSourcePropType;
  category: string;
  tags: string[];
  color: string;
  description?: string;
}

export interface SavedStyle extends Style {
  folderId: string;
  notes?: string;
  savedAt: string;
}

export interface LookbookFolder {
  id: string;
  name: string;
  createdAt: string;
  color: string;
  outfitCount?: number;
}

interface LookbookContextProps {
  folders: LookbookFolder[];
  savedStyles: SavedStyle[];
  loading: boolean;
  error: string | null;
  createFolder: (name: string, color: string) => Promise<{ success: boolean; folderName?: string; error?: string }>;
  deleteFolder: (folderId: string) => Promise<{ success: boolean; error?: string }>;
  updateFolder: (folderId: string, name: string) => Promise<void>;
  refreshFolders: () => Promise<void>;
  saveStyleToFolder: (style: Style, folderId: string) => Promise<void>;
  removeStyleFromFolder: (styleId: number, folderId: string) => Promise<void>;
  updateStyleNotes: (styleId: number, folderId: string, notes: string) => Promise<void>;
  getStylesInFolder: (folderId: string) => SavedStyle[];
  isStyleSaved: (styleId: number) => boolean;
  getStyleFolder: (styleId: number) => string | null;
  getLookbookWithOutfits: (folderId: string) => Promise<LookbookWithOutfits | null>;
}

// Context
const LookbookContext = createContext<LookbookContextProps | undefined>(undefined);

// Color palette for folders
const folderColors = [
  '#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

// Provider
export function LookbookProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<LookbookFolder[]>([]);
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load folders from API
  const loadFolders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LookbookService.getAllLookbooks();
      
      if (response.success && response.data) {
        const foldersWithColors = response.data.map((lookbook, index) => ({
          id: lookbook.id,
          name: lookbook.name,
          createdAt: lookbook.createdAt,
          color: folderColors[index % folderColors.length],
        }));
        
        setFolders(foldersWithColors);
      } else {
        setError(response.message || 'Failed to load lookbooks');
      }
    } catch (error: any) {
      console.error('Error loading folders:', error);
      setError(error.message || 'Failed to load lookbooks');
    } finally {
      setLoading(false);
    }
  };

  // Load all saved styles from all folders
  const loadSavedStyles = async () => {
    try {
      const allStyles: SavedStyle[] = [];
      
      for (const folder of folders) {
        const response = await LookbookService.getLookbookById(folder.id);
        
        if (response.success && response.data?.outfits) {
          const stylesInFolder = response.data.outfits.map(outfit => ({
            id: outfit.id.hashCode ? outfit.id.hashCode() : Math.abs(outfit.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)),
            title: outfit.title,
            image: outfit.imageUrls?.[0] || '',
            category: outfit.category?.name || 'Style',
            tags: [outfit.category?.name?.toLowerCase() || 'style'],
            color: '#FF6B35',
            description: outfit.description,
            folderId: folder.id,
            savedAt: outfit.createdAt
          }));
          
          allStyles.push(...stylesInFolder);
        }
      }
      
      setSavedStyles(allStyles);
    } catch (error) {
      console.error('Error loading saved styles:', error);
    }
  };

  // Create new folder
  const createFolder = async (name: string, color: string) => {
    try {
      const response = await LookbookService.createLookbook({ name });
      
      if (response.success && response.data) {
        const newFolder: LookbookFolder = {
          id: response.data.id,
          name: response.data.name,
          createdAt: response.data.createdAt,
          color: color
        };
        
        setFolders(prev => [...prev, newFolder]);
        return { success: true, folderName: response.data.name };
      } else {
        return { success: false, error: response.message || 'Failed to create lookbook' };
      }
    } catch (error: any) {
      console.error('Error creating folder:', error);
      return { success: false, error: error.message || 'Failed to create lookbook' };
    }
  };

  // Delete folder
  const deleteFolder = async (folderId: string) => {
    try {
      const response = await LookbookService.deleteLookbook(folderId);
      
      if (response.success) {
        setFolders(prev => prev.filter(folder => folder.id !== folderId));
        setSavedStyles(prev => prev.filter(style => style.folderId !== folderId));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Failed to delete lookbook' };
      }
    } catch (error: any) {
      console.error('Error deleting folder:', error);
      return { success: false, error: error.message || 'Failed to delete lookbook' };
    }
  };

  // Update folder name
  const updateFolder = async (folderId: string, name: string) => {
    try {
      const response = await LookbookService.updateLookbook(folderId, { name });
      
      if (response.success && response.data) {
        setFolders(prev => 
          prev.map(folder => 
            folder.id === folderId 
              ? { ...folder, name: response.data!.name }
              : folder
          )
        );
      }
    } catch (error: any) {
      console.error('Error updating folder:', error);
    }
  };

  // Save style to folder
  const saveStyleToFolder = async (style: Style, folderId: string) => {
    try {
      // Get the original outfit ID if this is an outfit-based style
      let outfitId: string;
      
      if (isOutfitStyle(style.id)) {
        const originalOutfitId = getOutfitIdFromStyleId(style.id);
        if (!originalOutfitId) {
          console.error('Could not find original outfit ID');
          return;
        }
        outfitId = originalOutfitId;
      } else {
        // For non-outfit styles, we might need to handle differently
        // For now, we'll show an error since the API expects outfit IDs
        console.error('Can only save outfit-based styles to lookbooks');
        return;
      }

      const response = await LookbookService.addOutfitToLookbook(folderId, { outfitId });
      
      if (response.success) {
        const savedStyle: SavedStyle = {
          ...style,
          folderId,
          savedAt: new Date().toISOString()
        };

        setSavedStyles(prev => {
          // Remove from other folders first
          const filtered = prev.filter(s => s.id !== style.id);
          return [...filtered, savedStyle];
        });
        
        // Success handled by the calling component
      } else {
        console.error('Failed to save style:', response.message);
      }
    } catch (error: any) {
      console.error('Error saving style:', error);
    }
  };

  // Remove style from folder
  const removeStyleFromFolder = async (styleId: number, folderId: string) => {
    try {
      // Get the original outfit ID
      let outfitId: string;
      
      if (isOutfitStyle(styleId)) {
        const originalOutfitId = getOutfitIdFromStyleId(styleId);
        if (!originalOutfitId) {
          console.error('Could not find original outfit ID');
          return;
        }
        outfitId = originalOutfitId;
      } else {
        console.error('Can only remove outfit-based styles from lookbooks');
        return;
      }

      const response = await LookbookService.removeOutfitFromLookbook(folderId, { outfitId });
      
      if (response.success) {
        setSavedStyles(prev => 
          prev.filter(style => !(style.id === styleId && style.folderId === folderId))
        );
        // Success handled by the calling component
      } else {
        console.error('Failed to remove style:', response.message);
      }
    } catch (error: any) {
      console.error('Error removing style:', error);
    }
  };

  // Update style notes (local only for now, as API doesn't support notes)
  const updateStyleNotes = async (styleId: number, folderId: string, notes: string) => {
    setSavedStyles(prev =>
      prev.map(style =>
        style.id === styleId && style.folderId === folderId
          ? { ...style, notes }
          : style
      )
    );
  };

  // Get styles in folder
  const getStylesInFolder = (folderId: string) => {
    return savedStyles.filter(style => style.folderId === folderId);
  };

  // Check if style is saved
  const isStyleSaved = (styleId: number) => {
    return savedStyles.some(style => style.id === styleId);
  };

  // Get folder containing style
  const getStyleFolder = (styleId: number) => {
    const savedStyle = savedStyles.find(style => style.id === styleId);
    return savedStyle ? savedStyle.folderId : null;
  };

  // Get lookbook with outfits
  const getLookbookWithOutfits = async (folderId: string): Promise<LookbookWithOutfits | null> => {
    try {
      const response = await LookbookService.getLookbookById(folderId);
      return response.success ? response.data || null : null;
    } catch (error) {
      console.error('Error getting lookbook with outfits:', error);
      return null;
    }
  };

  // Refresh folders
  const refreshFolders = async () => {
    await loadFolders();
  };

  // Load data on mount
  useEffect(() => {
    loadFolders();
  }, []);

  // Load saved styles when folders change
  useEffect(() => {
    if (folders.length > 0) {
      loadSavedStyles();
    }
  }, [folders]);

  const lookbookContext: LookbookContextProps = {
    folders,
    savedStyles,
    loading,
    error,
    createFolder,
    deleteFolder,
    updateFolder,
    refreshFolders,
    saveStyleToFolder,
    removeStyleFromFolder,
    updateStyleNotes,
    getStylesInFolder,
    isStyleSaved,
    getStyleFolder,
    getLookbookWithOutfits
  };

  return (
    <LookbookContext.Provider value={lookbookContext}>
      {children}
    </LookbookContext.Provider>
  );
}

// Hook
export function useLookbook() {
  const context = useContext(LookbookContext);
  if (context === undefined) {
    throw new Error('useLookbook must be used within a LookbookProvider');
  }
  return context;
} 