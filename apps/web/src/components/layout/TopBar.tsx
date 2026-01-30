import { useState, useRef, useEffect } from "react";
import { useAuth, useLanguage, useTheme } from "../../contexts";

// ============================================
// Top Bar - Header with Profile & Quick Actions
// ============================================

interface TopBarProps {
  title?: string;
  subtitle?: string;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function TopBar({ title, subtitle, onOpenSettings, onLogout }: TopBarProps) {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
      isDark 
        ? 'bg-background/80 border-white/5' 
        : 'bg-background/80 border-black/5'
    }`}>
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
            isDark 
              ? 'bg-mornye/20 text-mornye' 
              : 'bg-mornye-light/20 text-mornye-light'
          }`}>
            H
          </div>
          
          {/* Title */}
          {title && (
            <div>
              <h1 className="font-semibold text-text-primary text-lg leading-tight">{title}</h1>
              {subtitle && (
                <p className="text-text-muted text-xs">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Command Palette Hint */}
          <button 
            onClick={() => {
              // Trigger Ctrl+K
              const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
              window.dispatchEvent(event);
            }}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isDark 
                ? 'bg-white/5 text-gray-400 hover:bg-white/10' 
                : 'bg-black/5 text-gray-500 hover:bg-black/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">Cari...</span>
            <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
              ⌘K
            </kbd>
          </button>

          {/* New Post Button */}
          <button className={`p-2 rounded-xl transition-colors ${
            isDark 
              ? 'text-mornye hover:bg-mornye/10' 
              : 'text-mornye-light hover:bg-mornye-light/10'
          }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all ${
                showDropdown 
                  ? isDark ? 'bg-white/10' : 'bg-black/10'
                  : isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                isDark 
                  ? 'bg-mornye/20 text-mornye' 
                  : 'bg-mornye-light/20 text-mornye-light'
              }`}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              
              {/* Name (hidden on mobile) */}
              <span className="hidden sm:block text-sm font-medium text-text-primary max-w-[100px] truncate">
                {user?.nickname || user?.name?.split(" ")[0]}
              </span>
              
              {/* Chevron */}
              <svg className={`w-4 h-4 text-text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className={`absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden shadow-xl border ${
                isDark 
                  ? 'bg-[#1a1a24] border-white/10' 
                  : 'bg-white border-black/5'
              }`}>
                {/* User Info */}
                <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${
                      isDark 
                        ? 'bg-mornye/20 text-mornye' 
                        : 'bg-mornye-light/20 text-mornye-light'
                    }`}>
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-text-primary truncate">
                          {user?.name}
                        </span>
                        {isAdmin && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-500">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-text-muted text-sm truncate block">
                        @{user?.nickname?.toLowerCase().replace(/\s+/g, '') || 'user'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => { onOpenSettings(); setShowDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t.nav.settings}
                  </button>

                  <button
                    onClick={() => { onLogout(); setShowDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-rose-400 ${
                      isDark ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
                    }`}
                  >
                    <svg className="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
