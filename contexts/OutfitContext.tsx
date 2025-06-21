import OutfitService from '@/api/outfit.service';
import { Outfit } from '@/api/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface OutfitContextType {
  // State
  outfits: Outfit[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchOutfits: (refresh?: boolean) => Promise<void>;
  searchOutfits: (query: string) => Promise<Outfit[]>;
  getOutfitById: (id: string) => Promise<Outfit | null>;
  refreshOutfits: () => Promise<void>;
}

const OutfitContext = createContext<OutfitContextType | undefined>(undefined);

interface OutfitProviderProps {
  children: ReactNode;
}

export function OutfitProvider({ children }: OutfitProviderProps) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all outfits
  const fetchOutfits = async (refresh: boolean = false) => {
    if (loading && !refresh) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await OutfitService.getAllOutfits();
      
      if (response.success && response.data) {
        setOutfits(response.data);
      } else {
        setError(response.message || 'Failed to fetch outfits');
      }
    } catch (error: any) {
      console.error('Error fetching outfits:', error);
      setError(error.message || 'An error occurred while fetching outfits');
    } finally {
      setLoading(false);
    }
  };

  // Search outfits
  const searchOutfits = async (query: string): Promise<Outfit[]> => {
    try {
      const response = await OutfitService.searchOutfits(query);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error: any) {
      console.error('Error searching outfits:', error);
      Alert.alert('Search Error', error.message || 'Failed to search outfits');
      return [];
    }
  };

  // Get outfit by ID
  const getOutfitById = async (id: string): Promise<Outfit | null> => {
    try {
      // First check if we already have the outfit in our state
      const existingOutfit = outfits.find(outfit => outfit.id === id);
      if (existingOutfit) {
        return existingOutfit;
      }

      // If not found in state, fetch from API
      const response = await OutfitService.getOutfitById(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Outfit not found');
      }
    } catch (error: any) {
      console.error('Error fetching outfit by ID:', error);
      Alert.alert('Error', error.message || 'Failed to fetch outfit');
      return null;
    }
  };

  // Refresh outfits
  const refreshOutfits = async () => {
    await fetchOutfits(true);
  };

  // Load outfits on mount
  useEffect(() => {
    fetchOutfits();
  }, []);

  const value: OutfitContextType = {
    outfits,
    loading,
    error,
    fetchOutfits,
    searchOutfits,
    getOutfitById,
    refreshOutfits,
  };

  return (
    <OutfitContext.Provider value={value}>
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfit() {
  const context = useContext(OutfitContext);
  if (context === undefined) {
    throw new Error('useOutfit must be used within an OutfitProvider');
  }
  return context;
} 