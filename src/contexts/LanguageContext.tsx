import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string | null;
  is_active: boolean;
}

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (code: string) => void;
  languages: Language[];
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('preferred-language') || 'en';
  });
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    localStorage.setItem('preferred-language', currentLanguage);
  }, [currentLanguage]);

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setLanguages(data || []);
    } catch (err) {
      console.error('Error fetching languages:', err);
      // Fallback languages
      setLanguages([
        { id: '1', code: 'en', name: 'English', native_name: 'English', flag_emoji: '🇺🇸', is_active: true },
        { id: '2', code: 'es', name: 'Spanish', native_name: 'Español', flag_emoji: '🇪🇸', is_active: true },
        { id: '3', code: 'fr', name: 'French', native_name: 'Français', flag_emoji: '🇫🇷', is_active: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, languages, loading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
