import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getLocale, setLocale as setParaglideLocale, locales, type Locale } from './paraglide/runtime';
import { createMessagesProxy, type MessageFunctions, type MessageKey } from './messagesDictionary';

export type AppLocale = 'sr' | 'en';

interface I18nContextType {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  m: MessageFunctions;
  localize: (sr: string, en?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    try {
      const saved = localStorage.getItem('PARAGLIDE_LOCALE');
      if (saved === 'en' || saved === 'sr') {
        try { setParaglideLocale(saved, { reload: false }); } catch {}
        return saved;
      }
      try {
        const initial = getLocale();
        return (initial === 'en' ? 'en' : 'sr');
      } catch {
        return 'sr';
      }
    } catch {
      return 'sr';
    }
  });

  const handleSetLocale = (newLocale: AppLocale) => {
    try {
      localStorage.setItem('PARAGLIDE_LOCALE', newLocale);
      try { setParaglideLocale(newLocale, { reload: false }); } catch {}
      setLocaleState(newLocale);
      document.documentElement.lang = newLocale;
    } catch (e) {
      console.error('Failed to set locale:', e);
    }
  };

  const toggleLocale = () => {
    handleSetLocale(locale === 'sr' ? 'en' : 'sr');
  };

  const localize = (srText: string, enText?: string): string => {
    if (locale === 'en') {
      return enText || srText;
    }
    return srText;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const messages = useMemo(() => {
    return createMessagesProxy(() => locale);
  }, [locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        toggleLocale,
        m: messages,
        localize
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    let currentLocale: AppLocale = 'sr';
    try {
      currentLocale = (getLocale() === 'en' ? 'en' : 'sr') as AppLocale;
    } catch {
      currentLocale = 'sr';
    }
    const fallbackMessages = createMessagesProxy(() => currentLocale);
    return {
      locale: currentLocale,
      setLocale: (l: AppLocale) => {
        try { setParaglideLocale(l, { reload: false }); } catch {}
      },
      toggleLocale: () => {},
      m: fallbackMessages,
      localize: (sr: string, en?: string) => (currentLocale === 'en' ? (en || sr) : sr)
    };
  }
  return context;
};

export const m = createMessagesProxy(() => {
  try {
    const saved = localStorage.getItem('PARAGLIDE_LOCALE');
    if (saved === 'en' || saved === 'sr') return saved;
    return (getLocale() === 'en' ? 'en' : 'sr');
  } catch {
    return 'sr';
  }
});

export { getLocale, setParaglideLocale };
