import { createContext, useContext, useState, ReactNode } from 'react';
import { BookDetails } from './../types/BooksDetails';

interface FavoriteContextType {
  favorites: BookDetails[];
  addFavorite: (book: BookDetails) => void;
  removeFavorite: (title: string) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('Erro useFavorites');
  }
  return context;
};

interface FavoriteProviderProps {
  children: ReactNode;
}

export const FavoriteProvider = ({ children }: FavoriteProviderProps) => {
  const [favorites, setFavorites] = useState<BookDetails[]>([]);

  const addFavorite = (book: BookDetails) => {
    setFavorites((prev) => [...prev, book]);
  };

  const removeFavorite = (title: string) => {
    setFavorites((prev) => prev.filter(book => book.title !== title));
  };

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};