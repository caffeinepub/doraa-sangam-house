import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '../hooks/useTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ThemeSwitcher() {
  const { themePreference, setTheme } = useTheme();

  const options: { value: ThemeMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="w-5 h-5" />,
      description: 'Luxury dark theme with deep plum and gold accents',
    },
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="w-5 h-5" />,
      description: 'Clean light theme with refined elegance',
    },
    {
      value: 'system',
      label: 'System',
      icon: <Monitor className="w-5 h-5" />,
      description: 'Automatically match your device settings',
    },
  ];

  return (
    <Card
      className="border-2 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--gold-border)',
      }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-serif" style={{ color: 'var(--heading-color)' }}>
          Theme Settings
        </CardTitle>
        <CardDescription style={{ color: 'var(--muted-text)' }}>
          Choose your preferred color theme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
              themePreference === option.value
                ? 'border-gold shadow-gold-glow'
                : 'border-transparent hover:border-gold/50'
            }`}
            style={{
              backgroundColor: themePreference === option.value ? 'var(--selected-bg)' : 'var(--option-bg)',
              color: 'var(--text-color)',
            }}
          >
            <div
              className={`flex-shrink-0 transition-colors duration-300 ${
                themePreference === option.value ? 'text-gold' : 'text-muted'
              }`}
              style={{
                color: themePreference === option.value ? 'var(--gold-accent)' : 'var(--muted-text)',
              }}
            >
              {option.icon}
            </div>
            <div className="flex-1 text-left">
              <div
                className="font-semibold text-base mb-1"
                style={{ color: themePreference === option.value ? 'var(--gold-accent)' : 'var(--text-color)' }}
              >
                {option.label}
              </div>
              <div className="text-sm" style={{ color: 'var(--muted-text)' }}>
                {option.description}
              </div>
            </div>
            {themePreference === option.value && (
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--gold-accent)' }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--gold-accent)' }} />
              </div>
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
