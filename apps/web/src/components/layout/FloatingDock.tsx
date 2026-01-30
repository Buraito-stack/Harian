import { useState, useEffect, useCallback } from "react";
import { useAuth, useLanguage, useTheme } from "../../contexts";

// ============================================
// Floating Dock - macOS-style Bottom Navigation
// ============================================

export type NavItem = "home" | "explore" | "notifications" | "messages" | "bookmarks" | "todos" | "profile" | "settings";

interface FloatingDockProps {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
}

interface DockItem {
  id: NavItem;
  label: string;
  icon: JSX.Element;
  badge?: number;
}

export function FloatingDock({ activeItem, onNavigate }: FloatingDockProps) {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<NavItem | null>(null);

  const dockItems: DockItem[] = [
    {
      id: "home",
      label: t.nav.home,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "explore",
      label: t.nav.explore,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: "notifications",
      label: t.nav.notifications,
      badge: 3,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      id: "messages",
      label: t.nav.messages,
      badge: 2,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: "todos",
      label: t.nav.todos,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "bookmarks",
      label: t.nav.bookmarks,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {/* Dock Container */}
      <div className={`flex items-end gap-1 px-3 py-2 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-[#1a1a24]/80 border-white/10 shadow-black/50' 
          : 'bg-white/80 border-black/5 shadow-black/10'
      }`}>
        {dockItems.map((item) => {
          const isActive = activeItem === item.id;
          const isHovered = hoveredItem === item.id;
          const shouldScale = isHovered || (hoveredItem && (
            dockItems.findIndex(i => i.id === hoveredItem) === dockItems.findIndex(i => i.id === item.id) - 1 ||
            dockItems.findIndex(i => i.id === hoveredItem) === dockItems.findIndex(i => i.id === item.id) + 1
          ));

          return (
            <div key={item.id} className="relative flex flex-col items-center">
              {/* Tooltip */}
              <div className={`absolute -top-10 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              } ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                {item.label}
              </div>

              {/* Dock Item */}
              <button
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative p-3 rounded-xl transition-all duration-200 ease-out ${
                  isActive
                    ? isDark 
                      ? 'bg-mornye text-white shadow-lg shadow-mornye/30' 
                      : 'bg-mornye-light text-white shadow-lg shadow-mornye-light/30'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/10'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                }`}
                style={{
                  transform: isHovered 
                    ? 'translateY(-8px) scale(1.2)' 
                    : shouldScale 
                      ? 'translateY(-4px) scale(1.1)' 
                      : 'translateY(0) scale(1)',
                }}
              >
                {item.icon}
                
                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full shadow-lg">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Active Indicator */}
              {isActive && (
                <div className={`w-1 h-1 rounded-full mt-1 ${isDark ? 'bg-mornye' : 'bg-mornye-light'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
