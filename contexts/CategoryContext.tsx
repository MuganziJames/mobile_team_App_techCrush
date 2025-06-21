import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { categoryService } from '../api/category.service';
import { Category } from '../api/types';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryByName: (name: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const refreshCategories = async () => {
    await loadCategories();
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };

  const getCategoryByName = (name: string): Category | undefined => {
    return categories.find(category => 
      category.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    refreshCategories,
    getCategoryById,
    getCategoryByName,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
} 