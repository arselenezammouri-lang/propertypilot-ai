'use client';

import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocale as useLocaleContext } from '@/lib/i18n/locale-context';
import { Locale } from '@/lib/i18n/config';

type SupportedLocale = Locale;

const LANGUAGE_OPTIONS: { value: SupportedLocale; label: string; flag: string }[] = [
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
  { value: 'ar', label: 'العربية', flag: '🇦🇪' },
];

export function LanguageSelector() {
  const { locale, setLocale } = useLocaleContext();

  const handleSelect = (value: SupportedLocale) => {
    setLocale(value);
  };

  const currentOption = LANGUAGE_OPTIONS.find(o => o.value === locale) || LANGUAGE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 border border-white/[0.08] hover:border-white/20 transition-all"
          data-testid="button-language-selector"
        >
          <Languages className="h-4 w-4" />
          <span className="text-lg">{currentOption.flag}</span>
          <span className="text-xs font-medium hidden sm:inline">{currentOption.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-black/90 backdrop-blur-xl border-white/[0.08]"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`flex items-center gap-3 cursor-pointer ${
              locale === option.value ? 'bg-primary/20 text-primary' : ''
            }`}
          >
            <span className="text-lg">{option.flag}</span>
            <span className="flex-1">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
