import { useLanguage } from "../../contexts";
import type { Language } from "../../types";

// ============================================
// Language Switcher Component
// ============================================

interface LanguageSwitcherProps {
  variant?: "dropdown" | "toggle";
}

export function LanguageSwitcher({ variant = "toggle" }: LanguageSwitcherProps) {
  const { language, setLanguage, languageNames, availableLanguages } = useLanguage();

  if (variant === "toggle") {
    return (
      <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1">
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200
              ${
                language === lang
                  ? "bg-brand text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }
            `}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="
          appearance-none bg-white/5 border border-white/10 rounded-xl
          px-4 py-2 pr-8 text-sm text-white cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand-light
          transition-colors duration-200
        "
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang} className="bg-slate-900 text-white">
            {languageNames[lang]}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
