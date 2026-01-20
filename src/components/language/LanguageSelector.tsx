import React from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSelector() {
  const { currentLanguage, setCurrentLanguage, languages, loading } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <Globe className="w-4 h-4 text-muted-foreground animate-pulse" />
      </div>
    );
  }

  return (
    <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
      <SelectTrigger className="w-[140px] bg-background border-input" aria-label="Select language">
        <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag_emoji}</span>
              <span>{lang.native_name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
