import React, { createContext, useContext, useEffect, useState } from 'react';
import { MoodSlug } from '../lib/database.types';

interface ThemeContextType {
  mood: MoodSlug;
  setMood: (mood: MoodSlug) => void;
  moodName: string;
  moodDescriptor: string;
}

const MOOD_META: Record<MoodSlug, { name: string; descriptor: string }> = {
  adda: {
    name: 'Classic Adda',
    descriptor: 'Chai-stall comfort & nostalgic gossip',
  },
  classics: {
    name: 'Café Classics',
    descriptor: 'Comfort brews, grilled toasties & vinyl hum',
  },
  lab: {
    name: 'Trend Lab',
    descriptor: 'Matcha, cold brew & small batch drops',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMoodState] = useState<MoodSlug>(() => {
    const saved = localStorage.getItem('cw.theme');
    if (saved === 'adda' || saved === 'classics' || saved === 'lab') {
      return saved;
    }
    return 'adda';
  });

  const setMood = (newMood: MoodSlug) => {
    setMoodState(newMood);
    localStorage.setItem('cw.theme', newMood);
    document.documentElement.setAttribute('data-theme', newMood);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mood);
  }, [mood]);

  return (
    <ThemeContext.Provider
      value={{
        mood,
        setMood,
        moodName: MOOD_META[mood].name,
        moodDescriptor: MOOD_META[mood].descriptor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
