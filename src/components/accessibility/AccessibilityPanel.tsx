import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Palette,
  Type,
  Maximize2,
  Space,
  Zap,
  Volume2,
  Mic,
  Focus,
  RotateCcw,
} from 'lucide-react';

interface AccessibilityPanelProps {
  onClose?: () => void;
}

export function AccessibilityPanel({ onClose }: AccessibilityPanelProps) {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  const accessibilityOptions = [
    {
      id: 'highContrast' as const,
      label: 'High Contrast Mode',
      description: 'Increase contrast for better visibility',
      icon: Eye,
      category: 'Visual',
    },
    {
      id: 'colorBlindMode' as const,
      label: 'Color Blind Friendly',
      description: 'Use patterns and colors suitable for color blindness',
      icon: Palette,
      category: 'Visual',
    },
    {
      id: 'dyslexiaFont' as const,
      label: 'Dyslexia-Friendly Font',
      description: 'Use OpenDyslexic font for easier reading',
      icon: Type,
      category: 'Reading',
    },
    {
      id: 'largeText' as const,
      label: 'Large Text',
      description: 'Increase text size throughout the platform',
      icon: Maximize2,
      category: 'Reading',
    },
    {
      id: 'increasedSpacing' as const,
      label: 'Increased Spacing',
      description: 'More space between letters, words, and lines',
      icon: Space,
      category: 'Reading',
    },
    {
      id: 'reduceMotion' as const,
      label: 'Reduce Motion',
      description: 'Minimize animations and transitions',
      icon: Zap,
      category: 'Cognitive',
    },
    {
      id: 'textToSpeech' as const,
      label: 'Text-to-Speech',
      description: 'Enable screen reader support and audio feedback',
      icon: Volume2,
      category: 'Audio',
    },
    {
      id: 'speechToText' as const,
      label: 'Speech-to-Text',
      description: 'Use voice commands to navigate and input text',
      icon: Mic,
      category: 'Input',
    },
    {
      id: 'focusHighlight' as const,
      label: 'Focus Highlight',
      description: 'Show clear focus indicators for keyboard navigation',
      icon: Focus,
      category: 'Navigation',
    },
  ];

  const categories = [...new Set(accessibilityOptions.map((o) => o.category))];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Customize your learning experience. All settings are saved automatically.
      </p>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
            {category}
          </h3>
          <div className="space-y-2">
            {accessibilityOptions
              .filter((option) => option.category === category)
              .map((option) => (
                <div
                  key={option.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <option.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={option.id}
                      className="font-medium cursor-pointer"
                    >
                      {option.label}
                    </label>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                  <Switch
                    id={option.id}
                    checked={settings[option.id]}
                    onCheckedChange={(checked) => updateSetting(option.id, checked)}
                    aria-describedby={`${option.id}-description`}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Reset Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={resetSettings}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
          Reset to Defaults
        </Button>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="p-4 rounded-xl bg-info/10 text-info">
        <h4 className="font-medium mb-2">Keyboard Navigation</h4>
        <ul className="text-sm space-y-1">
          <li><kbd className="px-1.5 py-0.5 bg-info/20 rounded text-xs">Tab</kbd> - Navigate between elements</li>
          <li><kbd className="px-1.5 py-0.5 bg-info/20 rounded text-xs">Enter</kbd> / <kbd className="px-1.5 py-0.5 bg-info/20 rounded text-xs">Space</kbd> - Activate buttons</li>
          <li><kbd className="px-1.5 py-0.5 bg-info/20 rounded text-xs">Esc</kbd> - Close dialogs</li>
          <li><kbd className="px-1.5 py-0.5 bg-info/20 rounded text-xs">Arrow keys</kbd> - Navigate menus</li>
        </ul>
      </div>
    </div>
  );
}
