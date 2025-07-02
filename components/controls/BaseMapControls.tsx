'use client';

import { Map, Sun, Moon, Satellite } from 'lucide-react';
import { useMapStore, BaseMapStyle } from '@/store/mapStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BaseMapControls() {
  const { baseMapStyle, setBaseMapStyle } = useMapStore();

  const mapStyles: { id: BaseMapStyle; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'satellite', label: 'Satellite', icon: Satellite },
  ];

  return (
    <div className={cn(
      "bg-background/90 backdrop-blur-sm rounded-lg border border-border/50",
      "p-4 shadow-lg space-y-3"
    )}>
      <div className="flex items-center space-x-2">
        <Map className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Base Map</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {mapStyles.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={baseMapStyle === id ? "default" : "outline"}
            size="sm"
            onClick={() => setBaseMapStyle(id)}
            className={cn(
              "flex flex-col items-center space-y-1 h-auto py-2",
              baseMapStyle === id 
                ? "bg-primary text-primary-foreground" 
                : "bg-background/50 hover:bg-muted/50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}