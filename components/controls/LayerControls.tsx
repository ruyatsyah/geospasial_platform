'use client';

import { Eye, EyeOff, Layers } from 'lucide-react';
import { useMapStore } from '@/store/mapStore';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function LayerControls() {
  const { showBuildings, toggleBuildings, geoJsonData } = useMapStore();

  if (!geoJsonData) return null;

  const buildingCount = geoJsonData.features.length;

  return (
    <div className={cn(
      "bg-background/90 backdrop-blur-sm rounded-lg border border-border/50",
      "p-4 shadow-lg space-y-3"
    )}>
      <div className="flex items-center space-x-2">
        <Layers className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Layers</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {showBuildings ? (
              <Eye className="w-4 h-4 text-primary" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            )}
            <Label htmlFor="buildings-toggle" className="text-sm cursor-pointer">
              Buildings
            </Label>
            <span className="text-xs text-muted-foreground">
              ({buildingCount})
            </span>
          </div>
          <Switch
            id="buildings-toggle"
            checked={showBuildings}
            onCheckedChange={toggleBuildings}
          />
        </div>
      </div>
    </div>
  );
}