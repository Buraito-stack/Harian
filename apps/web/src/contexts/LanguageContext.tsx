import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, defaultLanguage, languageNames } from "../locales";
import type { Language, Translations } from "../types";

// ============================================
// Language Context
// ============================================

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  languageNames: Record<Language, string>;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "harian_language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return defaultLanguage;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (stored === "en" || stored === "id")) {
    return stored;
  }

  // Detect browser language
  const browserLang = navigator.language.split("-")[0];
  if (browserLang === "id") return "id";

  return defaultLanguage;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: translations[language],
      languageNames,
      availableLanguages: Object.keys(translations) as Language[],
    }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
