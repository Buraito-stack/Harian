import { useState, type FormEvent } from "react";
import { useAuth, useLanguage, useTheme } from "../../contexts";
import { Button, Input, Card, CardContent } from "../../components";
import { SettingsModal } from "../../components/common/SettingsModal";

// ============================================
// Register Page
// ============================================

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    nickname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = t.errors.requiredField;
    }

    if (!nickname.trim()) {
      newErrors.nickname = t.errors.requiredField;
    } else if (nickname.length < 3) {
      newErrors.nickname = "Nickname minimal 3 karakter";
    }

    if (!email) {
      newErrors.email = t.errors.requiredField;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t.errors.invalidEmail;
    }

    if (!password) {
      newErrors.password = t.errors.requiredField;
    } else if (password.length < 8) {
      newErrors.password = t.errors.passwordTooShort;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t.errors.requiredField;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t.errors.passwordMismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({ name, nickname, email, password, confirmPassword });
    } catch (err) {
      let message = t.common.error;
      if (err instanceof Error) {
        message = err.message;
      }
      setErrors({ general: message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative">
      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Settings Button - Top Right */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-6 right-6 p-2.5 rounded-md bg-surface/50 backdrop-blur-sm border border-border text-text-muted hover:text-text-primary hover:bg-surface transition-all"
        title={t.nav.settings}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-mornye/20' : 'bg-mornye-light/20'}`} />
        <div className={`absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-starlight/10' : 'bg-mornye-light/10'}`} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-mornye to-accent flex items-center justify-center shadow-glow">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{t.auth.createAccount}</h1>
          <p className="text-text-secondary">{t.auth.registerSubtitle}</p>
        </div>

        {/* Register Card */}
        <Card variant="elevated" padding="lg">
          <CardContent className="mt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                  {errors.general}
                </div>
              )}

              <Input
                label={t.auth.name}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                autoComplete="name"
              />

              <Input
                label={t.auth.nickname}
                type="text"
                placeholder="johndoe"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                error={errors.nickname}
                autoComplete="username"
              />

              <Input
                label={t.auth.email}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                autoComplete="email"
              />

              <Input
                label={t.auth.password}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                hint={!errors.password ? t.errors.passwordTooShort.replace("must be", "min") : undefined}
                autoComplete="new-password"
              />

              <Input
                label={t.auth.confirmPassword}
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <div className="pt-2">
                <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                  {t.auth.register}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface text-text-muted">
                  {t.auth.orContinueWith}
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="md">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="secondary" size="md">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-text-muted text-sm">
          {t.auth.haveAccount}{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-accent hover:text-accent-hover font-medium transition-colors"
          >
            {t.auth.login}
          </button>
        </p>
      </div>
    </div>
  );
}
