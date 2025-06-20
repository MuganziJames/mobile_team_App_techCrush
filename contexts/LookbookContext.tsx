import AsyncStorage from '@react-native-async-storage/async-storage';
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
}

interface LookbookContextProps {
  folders: LookbookFolder[];
  savedStyles: SavedStyle[];
  createFolder: (name: string, color: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  saveStyleToFolder: (style: Style, folderId: string) => Promise<void>;
  removeStyleFromFolder: (styleId: number, folderId: string) => Promise<void>;
  updateStyleNotes: (styleId: number, folderId: string, notes: string) => Promise<void>;
  getStylesInFolder: (folderId: string) => SavedStyle[];
  isStyleSaved: (styleId: number) => boolean;
  getStyleFolder: (styleId: number) => string | null;
}

// Context
const LookbookContext = createContext<LookbookContextProps | undefined>(undefined);

// Default folders
const defaultFolders: LookbookFolder[] = [
  {
    id: 'favorites',
    name: 'Favorites',
    createdAt: new Date().toISOString(),
    color: '#FF6B35'
  },
  {
    id: 'inspiration',
    name: 'Inspiration',
    createdAt: new Date().toISOString(),
    color: '#4ECDC4'
  }
];

// Provider
export function LookbookProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<LookbookFolder[]>(defaultFolders);
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([]);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [foldersString, stylesString] = await Promise.all([
          AsyncStorage.getItem('lookbook_folders'),
          AsyncStorage.getItem('lookbook_styles')
        ]);

        if (foldersString) {
          const loadedFolders = JSON.parse(foldersString);
          setFolders(loadedFolders);
        }

        if (stylesString) {
          const loadedStyles = JSON.parse(stylesString);
          setSavedStyles(loadedStyles);
        }
      } catch (error) {
        console.error('Failed to load lookbook data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem('lookbook_folders', JSON.stringify(folders)),
          AsyncStorage.setItem('lookbook_styles', JSON.stringify(savedStyles))
        ]);
      } catch (error) {
        console.error('Failed to save lookbook data:', error);
      }
    };

    saveData();
  }, [folders, savedStyles]);

  const createFolder = async (name: string, color: string) => {
    const newFolder: LookbookFolder = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date().toISOString()
    };

    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = async (folderId: string) => {
    // Don't allow deletion of default folders
    if (folderId === 'favorites' || folderId === 'inspiration') {
      return;
    }

    setFolders(prev => prev.filter(folder => folder.id !== folderId));
    setSavedStyles(prev => prev.filter(style => style.folderId !== folderId));
  };

  const saveStyleToFolder = async (style: Style, folderId: string) => {
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
  };

  const removeStyleFromFolder = async (styleId: number, folderId: string) => {
    setSavedStyles(prev => 
      prev.filter(style => !(style.id === styleId && style.folderId === folderId))
    );
  };

  const updateStyleNotes = async (styleId: number, folderId: string, notes: string) => {
    setSavedStyles(prev =>
      prev.map(style =>
        style.id === styleId && style.folderId === folderId
          ? { ...style, notes }
          : style
      )
    );
  };

  const getStylesInFolder = (folderId: string) => {
    return savedStyles.filter(style => style.folderId === folderId);
  };

  const isStyleSaved = (styleId: number) => {
    return savedStyles.some(style => style.id === styleId);
  };

  const getStyleFolder = (styleId: number) => {
    const savedStyle = savedStyles.find(style => style.id === styleId);
    return savedStyle ? savedStyle.folderId : null;
  };

  const lookbookContext: LookbookContextProps = {
    folders,
    savedStyles,
    createFolder,
    deleteFolder,
    saveStyleToFolder,
    removeStyleFromFolder,
    updateStyleNotes,
    getStylesInFolder,
    isStyleSaved,
    getStyleFolder
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