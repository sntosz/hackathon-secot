'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilitySettings } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  announcement: { message: string; priority: 'polite' | 'assertive' } | null;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'normal',
  dyslexicFont: false,
  reduceAnimations: false,
  screenReaderOptimized: false,
  theme: 'light',
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
  announce: () => {},
  announcement: null,
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [announcement, setAnnouncement] = useState<{ message: string; priority: 'polite' | 'assertive' } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ufscar_a11y_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved accessibility settings', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('ufscar_a11y_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('ufscar_a11y_settings');
  };

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({ message, priority });
    setTimeout(() => {
      setAnnouncement(null);
    }, 4000);
  };

  // Sync classes to <html> tag
  useEffect(() => {
    const root = document.documentElement;

    // Theme & High Contrast
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.dyslexicFont) {
      root.classList.add('font-dyslexic');
    } else {
      root.classList.remove('font-dyslexic');
    }

    // Font Size
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${settings.fontSize}`);

    // Reduce animation
    if (settings.reduceAnimations) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings, announce, announcement }}>
      {children}
      {/* Screen Reader Live Region */}
      <div
        aria-live={announcement?.priority || 'polite'}
        aria-atomic="true"
        className="sr-only"
        tabIndex={-1}
      >
        {announcement?.message}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
