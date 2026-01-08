import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AccessibilitySettings, defaultAccessibilitySettings } from '@/types/accessibility';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'beyondextra-accessibility-settings';

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultAccessibilitySettings, ...JSON.parse(stored) };
        } catch {
          return defaultAccessibilitySettings;
        }
      }
    }
    return defaultAccessibilitySettings;
  });
  
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('colorblind-friendly', settings.colorBlindMode);
    root.classList.toggle('dyslexia-friendly', settings.dyslexiaFont);
    root.classList.toggle('large-text', settings.largeText);
    root.classList.toggle('increased-spacing', settings.increasedSpacing);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !settings.reduceMotion) {
      setSettings(prev => ({ ...prev, reduceMotion: true }));
    }
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultAccessibilitySettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  const speak = (text: string) => {
    if (!settings.textToSpeech || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        speak,
        stopSpeaking,
        isSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
