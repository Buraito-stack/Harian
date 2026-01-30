import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage, useTheme } from "../../contexts";
import type { NavItem } from "./FloatingDock";

// ============================================
// Command Palette - Spotlight-style Quick Navigation
// Press Ctrl+K or Cmd+K to open
// ============================================

interface CommandPaletteProps {
  onNavigate: (item: NavItem) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: JSX.Element;
  action: () => void;
  shortcut?: string;
  category: "navigation" | "action";
}

export function CommandPalette({ onNavigate, onOpenSettings, onLogout }: CommandPaletteProps) {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    // Navigation
    {
      id: "home",
      label: t.nav.home,
      description: "Kembali ke beranda",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
      action: () => { onNavigate("home"); setIsOpen(false); },
      shortcut: "G H",
      category: "navigation",
    },
    {
      id: "explore",
      label: t.nav.explore,
      description: "Jelajahi konten baru",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
      action: () => { onNavigate("explore"); setIsOpen(false); },
      shortcut: "G E",
      category: "navigation",
    },
    {
      id: "notifications",
      label: t.nav.notifications,
      description: "Lihat notifikasi terbaru",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
      action: () => { onNavigate("notifications"); setIsOpen(false); },
      shortcut: "G N",
      category: "navigation",
    },
    {
      id: "messages",
      label: t.nav.messages,
      description: "Buka pesan",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      action: () => { onNavigate("messages"); setIsOpen(false); },
      shortcut: "G M",
      category: "navigation",
    },
    {
      id: "todos",
      label: t.nav.todos,
      description: "Kelola tugas harianmu",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
      action: () => { onNavigate("todos"); setIsOpen(false); },
      shortcut: "G T",
      category: "navigation",
    },
    {
      id: "bookmarks",
      label: t.nav.bookmarks,
      description: "Lihat post tersimpan",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
      action: () => { onNavigate("bookmarks"); setIsOpen(false); },
      shortcut: "G B",
      category: "navigation",
    },
    {
      id: "profile",
      label: t.nav.profile,
      description: "Lihat profil kamu",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      action: () => { onNavigate("profile"); setIsOpen(false); },
      shortcut: "G P",
      category: "navigation",
    },
    // Actions
    {
      id: "settings",
      label: t.nav.settings,
      description: "Ubah pengaturan aplikasi",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      action: () => { onOpenSettings(); setIsOpen(false); },
      shortcut: ",",
      category: "action",
    },
    {
      id: "logout",
      label: "Keluar",
      description: "Logout dari akun",
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
      action: () => { onLogout(); setIsOpen(false); },
      category: "action",
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard shortcut to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filteredCommands[selectedIndex]?.action();
    }
  }, [filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette */}
      <div className={`fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 rounded-2xl overflow-hidden shadow-2xl border ${
        isDark 
          ? 'bg-[#1a1a24] border-white/10' 
          : 'bg-white border-black/5'
      }`}>
        {/* Search Input */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-black/5'}`}>
          <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Ketik perintah atau cari..."
            className={`flex-1 bg-transparent outline-none text-base ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
          />
          <kbd className={`px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredCommands.length > 0 ? (
            <>
              {/* Navigation Category */}
              {filteredCommands.some(c => c.category === "navigation") && (
                <div className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Navigasi
                </div>
              )}
              {filteredCommands.filter(c => c.category === "navigation").map((cmd, idx) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                    selectedIndex === idx 
                      ? isDark ? 'bg-mornye/20 text-mornye' : 'bg-mornye-light/10 text-mornye-light'
                      : isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span className={selectedIndex === idx ? '' : 'opacity-60'}>{cmd.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{cmd.label}</div>
                    {cmd.description && (
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cmd.description}</div>
                    )}
                  </div>
                  {cmd.shortcut && (
                    <kbd className={`px-2 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                      {cmd.shortcut}
                    </kbd>
                  )}
                </button>
              ))}

              {/* Action Category */}
              {filteredCommands.some(c => c.category === "action") && (
                <div className={`px-4 py-1.5 mt-2 text-[11px] uppercase tracking-wider font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Aksi
                </div>
              )}
              {filteredCommands.filter(c => c.category === "action").map((cmd, idx) => {
                const actualIdx = filteredCommands.filter(c => c.category === "navigation").length + idx;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      selectedIndex === actualIdx 
                        ? isDark ? 'bg-mornye/20 text-mornye' : 'bg-mornye-light/10 text-mornye-light'
                        : isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setSelectedIndex(actualIdx)}
                  >
                    <span className={selectedIndex === actualIdx ? '' : 'opacity-60'}>{cmd.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{cmd.label}</div>
                      {cmd.description && (
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cmd.description}</div>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <kbd className={`px-2 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </>
          ) : (
            <div className={`px-4 py-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Tidak ada hasil untuk "{search}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-4 py-2 border-t text-[11px] ${isDark ? 'border-white/5 text-gray-500' : 'border-black/5 text-gray-400'}`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>↑↓</kbd>
              navigasi
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>↵</kbd>
              pilih
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>Ctrl</kbd>
            +
            <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>K</kbd>
            untuk buka/tutup
          </span>
        </div>
      </div>
    </>
  );
}
