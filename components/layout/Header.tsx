'use client';

import { MapPin, Settings, Menu, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMapStore } from '@/store/mapStore';
import SearchComponent from '@/components/search/SearchComponent';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleSidebar?: () => void;
  showMenuButton?: boolean;
}

export default function Header({ onToggleSidebar, showMenuButton = false }: HeaderProps) {
  const { highlightedFeature, clearHighlight } = useMapStore();

  return (
    <header className={cn(
      "bg-background/95 backdrop-blur-sm border-b border-border/50",
      "px-4 py-3 flex items-center justify-between gap-4",
      "shadow-sm relative z-10"
    )}>
      <div className="flex items-center space-x-4">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">GIS Platform</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Geospatial Infrastructure Planning
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <SearchComponent />
      </div>

      <div className="flex items-center space-x-2">
        {highlightedFeature && (
          <div className="hidden sm:flex items-center space-x-2 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-lg">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {highlightedFeature.properties.RTNew}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHighlight}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              ×
            </Button>
          </div>
        )}
        
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}