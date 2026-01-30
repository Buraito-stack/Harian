import { useState } from "react";
import { LanguageProvider, AuthProvider, useAuth, ThemeProvider } from "./contexts";
import { LoginPage, RegisterPage, HomePage } from "./pages";

// ============================================
// HARIAN - Main Application
// ============================================

type AuthView = "login" | "register";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>("login");

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-mornye flex items-center justify-center shadow-lg shadow-accent/30 animate-pulse">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-secondary">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show auth pages
  if (!isAuthenticated) {
    if (authView === "register") {
      return <RegisterPage onSwitchToLogin={() => setAuthView("login")} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView("register")} />;
  }

  // Authenticated - show main app
  return <HomePage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
