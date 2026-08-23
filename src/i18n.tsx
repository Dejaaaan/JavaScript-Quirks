import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getLocale, setLocale as setParaglideLocale, locales, type Locale } from './paraglide/runtime';
import { createMessagesProxy, type MessageFunctions, type MessageKey } from './messagesDictionary';

export type AppLocale = 'sr' | 'en';

export function detectUserLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return 'sr';
  }

  // 1. Provera URL Query parametra (?lang=en ili ?lang=sr)
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const urlLang = searchParams.get('lang')?.toLowerCase();
    if (urlLang === 'en' || urlLang === 'sr') {
      try {
        localStorage.setItem('PARAGLIDE_LOCALE', urlLang);
      } catch {}
      return urlLang;
    }
  } catch {}

  // 2. Provera prethodnog eksplicitnog izbora u localStorage
  try {
    const saved = localStorage.getItem('PARAGLIDE_LOCALE');
    if (saved === 'en' || saved === 'sr') {
      return saved;
    }
  } catch {}

  // 3. Detekcija iz pretraživača (navigator.languages / navigator.language)
  try {
    const browserLanguages = navigator.languages && navigator.languages.length > 0 
      ? navigator.languages 
      : [navigator.language || ''];

    for (const lang of browserLanguages) {
      if (!lang) continue;
      const normalized = lang.toLowerCase().trim();
      const primaryLang = normalized.split(/[-_]/)[0];

      // Ako je domaći/regionalni jezik
      if (['sr', 'hr', 'bs', 'cnr', 'sh'].includes(primaryLang)) {
        return 'sr';
      }

      // Ako je engleski ili bilo koji drugi međunarodni jezik
      if (primaryLang === 'en') {
        return 'en';
      }
    }

    // Za ostale strane jezike koji nisu srpski/regionalni, engleski je pogodniji default
    const firstLang = (browserLanguages[0] || '').toLowerCase().split(/[-_]/)[0];
    if (firstLang && !['sr', 'hr', 'bs', 'cnr', 'sh'].includes(firstLang)) {
      return 'en';
    }
  } catch {}

  // 4. Bazični fallback
  try {
    const paraglideLocale = getLocale();
    if (paraglideLocale === 'en' || paraglideLocale === 'sr') {
      return paraglideLocale;
    }
  } catch {}

  return 'sr';
}

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
    const detected = detectUserLocale();
    try {
      setParaglideLocale(detected, { reload: false });
    } catch {}
    return detected;
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
    const currentLocale: AppLocale = detectUserLocale();
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
  return detectUserLocale();
});

export { getLocale, setParaglideLocale };
