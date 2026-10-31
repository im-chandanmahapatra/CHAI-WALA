import { useMemo } from 'react';

export function useSplitWords(text: string): string[] {
  return useMemo(() => {
    return text.split(' ').filter(Boolean);
  }, [text]);
}

export function useSplitChars(text: string): string[] {
  return useMemo(() => {
    return text.split('');
  }, [text]);
}
