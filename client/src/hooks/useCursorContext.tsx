import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CursorVariant = 'default' | 'pointer' | 'drag' | 'view' | 'button' | 'hidden';

interface CursorContextType {
  cursorVariant: CursorVariant;
  cursorText: string;
  isHovered: boolean;
  setCursorVariant: (variant: CursorVariant) => void;
  setCursorText: (text: string) => void;
  setIsHovered: (hovered: boolean) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <CursorContext.Provider
      value={{
        cursorVariant,
        cursorText,
        isHovered,
        setCursorVariant,
        setCursorText,
        setIsHovered,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    // Return dummy values if context is not yet mounted to avoid crashes
    return {
      cursorVariant: 'default' as CursorVariant,
      cursorText: '',
      isHovered: false,
      setCursorVariant: () => {},
      setCursorText: () => {},
      setIsHovered: () => {},
    };
  }
  return context;
};
