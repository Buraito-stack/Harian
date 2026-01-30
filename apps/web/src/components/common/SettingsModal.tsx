import { useState } from "react";
import { useLanguage, useTheme } from "../../contexts";
import type { Language, Theme } from "../../types";

// ============================================
// Settings Modal - Theme & Language
// ============================================

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language, setLanguage, t, languageNames, availableLanguages } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md rounded-lg bg-surface border border-border shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-text-primary">
              {t.nav.settings}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Theme Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {t.settings.appearance}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <ThemeCard
                  name="Stellar"
                  description="Deep space dark"
                  theme="dark"
                  isActive={theme === "dark"}
                  onClick={() => setTheme("dark")}
                  preview={
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#0B0E1A] border border-[#2D3748]" />
                      <div className="w-3 h-3 rounded-full bg-[#7A9CFF]" />
                      <div className="w-3 h-3 rounded-full bg-[#E0E7FF]" />
                    </div>
                  }
                />
                <ThemeCard
                  name="Ethereal"
                  description="Clean & bright"
                  theme="light"
                  isActive={theme === "light"}
                  onClick={() => setTheme("light")}
                  preview={
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]" />
                      <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                      <div className="w-3 h-3 rounded-full bg-[#1E293B]" />
                    </div>
                  }
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Language Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {t.settings.language}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableLanguages.map((lang) => (
                  <LanguageCard
                    key={lang}
                    code={lang}
                    name={languageNames[lang]}
                    isActive={language === lang}
                    onClick={() => setLanguage(lang)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-surface-hover/50 rounded-b-2xl">
            <p className="text-xs text-text-muted text-center">
              {language === "id" 
                ? "Pengaturan disimpan otomatis" 
                : "Settings are saved automatically"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Theme Card Component
interface ThemeCardProps {
  name: string;
  description: string;
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
  preview: React.ReactNode;
}

function ThemeCard({ name, description, isActive, onClick, preview }: ThemeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-md border-2 text-left transition-all
        ${isActive
          ? "border-accent bg-accent/10 shadow-glow-sm"
          : "border-border hover:border-accent/50 hover:bg-surface-hover"
        }
      `}
    >
      {isActive && (
        <div className="absolute top-2 right-2">
          <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div className="mb-2">{preview}</div>
      <p className="font-medium text-text-primary">{name}</p>
      <p className="text-xs text-text-muted">{description}</p>
    </button>
  );
}

// Language Card Component
interface LanguageCardProps {
  code: Language;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

function LanguageCard({ code, name, isActive, onClick }: LanguageCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-3 p-4 rounded-md border-2 text-left transition-all
        ${isActive
          ? "border-accent bg-accent/10 shadow-glow-sm"
          : "border-border hover:border-accent/50 hover:bg-surface-hover"
        }
      `}
    >
      {isActive && (
        <div className="absolute top-2 right-2">
          <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center">
        <span className="text-xs font-bold text-accent uppercase">{code}</span>
      </div>
      <span className="font-medium text-text-primary">{name}</span>
    </button>
  );
}
