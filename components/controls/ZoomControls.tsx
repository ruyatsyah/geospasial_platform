'use client';

import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useMapStore } from '@/store/mapStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ZoomControls() {
  const { mapZoom, setMapZoom, setMapCenter } = useMapStore();

  const zoomIn = () => {
    setMapZoom(Math.min(mapZoom + 1, 20));
  };

  const zoomOut = () => {
    setMapZoom(Math.max(mapZoom - 1, 1));
  };

  const resetView = () => {
    setMapCenter([-6.9793, 107.5896]); // Corrected coordinates for Indonesia
    setMapZoom(18);
  };

  return (
    <div className={cn(
      "bg-background/90 backdrop-blur-sm rounded-lg border border-border/50",
      "shadow-lg overflow-hidden"
    )}>
      <div className="flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          disabled={mapZoom >= 20}
          className={cn(
            "rounded-none border-b border-border/30 h-10 w-10 p-0",
            "hover:bg-muted/50 disabled:opacity-50"
          )}
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        <div className={cn(
          "flex items-center justify-center h-8 px-2",
          "text-xs font-mono text-muted-foreground bg-muted/20"
        )}>
          {mapZoom}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          disabled={mapZoom <= 1}
          className={cn(
            "rounded-none border-b border-border/30 h-10 w-10 p-0",
            "hover:bg-muted/50 disabled:opacity-50"
          )}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={resetView}
          className="rounded-none h-10 w-10 p-0 hover:bg-muted/50"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}