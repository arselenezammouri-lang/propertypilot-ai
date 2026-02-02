'use client';

import { useGeoConfig } from '@/hooks/use-geo-config';
import { Region } from '@/lib/geo/geo-detection';
import { Globe, DollarSign, Euro, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const REGION_OPTIONS: { value: Region; label: string; flag: string; icon: React.ReactNode }[] = [
  { value: 'usa', label: 'United States', flag: '🇺🇸', icon: <DollarSign className="h-4 w-4" /> },
  { value: 'europe', label: 'Europe', flag: '🇪🇺', icon: <Euro className="h-4 w-4" /> },
  { value: 'middleeast', label: 'Middle East', flag: '🇦🇪', icon: <Building2 className="h-4 w-4" /> },
  { value: 'global', label: 'Global', flag: '🌍', icon: <Globe className="h-4 w-4" /> },
];

export function RegionSelector() {
  const { region, setRegion, config, isLoading } = useGeoConfig();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2">
        <Globe className="h-4 w-4 animate-pulse" />
        <span className="text-xs">...</span>
      </Button>
    );
  }

  const currentOption = REGION_OPTIONS.find(o => o.value === region) || REGION_OPTIONS[3];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 border border-white/[0.08] hover:border-white/20 transition-all"
        >
          <span className="text-lg">{currentOption.flag}</span>
          <span className="text-xs font-medium hidden sm:inline">{config.currencySymbol}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-black/90 backdrop-blur-xl border-white/[0.08]"
      >
        {REGION_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setRegion(option.value)}
            className={`flex items-center gap-3 cursor-pointer ${
              region === option.value ? 'bg-primary/20 text-primary' : ''
            }`}
          >
            <span className="text-lg">{option.flag}</span>
            <span className="flex-1">{option.label}</span>
            {option.icon}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RegionSelector;
