"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCategory, CATEGORY_CONFIG } from "@/lib/utils/property-category";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

interface CategoryToggleProps {
  value: PropertyCategory | 'all';
  onValueChange: (value: PropertyCategory | 'all') => void;
  userPlan?: 'free' | 'starter' | 'pro' | 'agency';
}

export function CategoryToggle({ value, onValueChange, userPlan = 'free' }: CategoryToggleProps) {
  const canAccessCommercial = userPlan === 'pro' || userPlan === 'agency';

  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as PropertyCategory | 'all')} className="w-auto">
      <TabsList className="bg-muted/50 border">
        <TabsTrigger value="all" className="data-[state=active]:bg-purple-500/20">
          Tutti
        </TabsTrigger>
        <TabsTrigger value="RESIDENTIAL_SALE" className="data-[state=active]:bg-blue-500/20">
          {CATEGORY_CONFIG.RESIDENTIAL_SALE.emoji} Vendite
        </TabsTrigger>
        <TabsTrigger value="RESIDENTIAL_RENT" className="data-[state=active]:bg-green-500/20">
          {CATEGORY_CONFIG.RESIDENTIAL_RENT.emoji} Affitti
        </TabsTrigger>
        <TabsTrigger 
          value="COMMERCIAL" 
          className={`data-[state=active]:bg-purple-500/20 ${!canAccessCommercial ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!canAccessCommercial}
        >
          {CATEGORY_CONFIG.COMMERCIAL.emoji} Commerciale
          {!canAccessCommercial && (
            <Badge variant="outline" className="ml-2 border-amber-500/50 text-amber-400 text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Agency
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

