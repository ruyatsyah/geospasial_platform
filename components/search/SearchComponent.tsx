'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, X, Target } from 'lucide-react';
import { useMapStore, GeoJSONFeature } from '@/store/mapStore';
import { GeoDataService } from '@/services/geoDataService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SearchComponent() {
  const { 
    geoJsonData, 
    searchQuery, 
    setSearchQuery, 
    setMapCenter, 
    setMapZoom,
    setSelectedFeature,
    setHighlightedFeature,
    clearHighlight
  } = useMapStore();
  
  const [searchResults, setSearchResults] = useState<GeoJSONFeature[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      const results = GeoDataService.searchFeatures(geoJsonData, searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
      clearHighlight();
    }
  }, [searchQuery, geoJsonData, clearHighlight]);

  const handleResultClick = (feature: GeoJSONFeature) => {
    // Calculate center of the polygon
    const coordinates = feature.geometry.coordinates[0][0];
    const lats = coordinates.map(coord => coord[1]);
    const lngs = coordinates.map(coord => coord[0]);
    
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    
    // Set map view and highlight the feature
    setMapCenter([centerLat, centerLng]);
    setMapZoom(20);
    setSelectedFeature(feature);
    setHighlightedFeature(feature);
    
    // Clear search
    setSearchQuery('');
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    clearHighlight();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search by RT name or building ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "pl-10 pr-10 bg-background/90 backdrop-blur-sm",
            "border-border/50 focus:border-primary/50",
            "transition-all duration-200"
          )}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2 z-50",
          "bg-background/95 backdrop-blur-sm rounded-lg border border-border/50",
          "shadow-lg max-h-60 overflow-y-auto"
        )}>
          {searchResults.map((feature) => {
            const totalWaste = GeoDataService.calculateWasteIntensity(feature);
            const color = GeoDataService.getWasteColor(totalWaste);
            
            return (
              <button
                key={feature.properties.Id}
                onClick={() => handleResultClick(feature)}
                className={cn(
                  "w-full text-left p-3 hover:bg-muted/50 transition-colors",
                  "border-b border-border/30 last:border-b-0",
                  "flex items-center space-x-3 group"
                )}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white/50"
                    style={{ backgroundColor: color }}
                  />
                  <Target className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <p className="font-medium text-sm text-blue-600">{feature.properties.RTNew}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      ID: {feature.properties.Id}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {showResults && searchResults.length === 0 && searchQuery && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2 z-50",
          "bg-background/95 backdrop-blur-sm rounded-lg border border-border/50",
          "shadow-lg p-4 text-center text-muted-foreground text-sm"
        )}>
          <div className="flex items-center justify-center space-x-2">
            <Search className="w-4 h-4" />
            <span>No results found for "{searchQuery}"</span>
          </div>
          <p className="text-xs mt-1">Try searching by RT name (e.g., "RT 1") or building ID</p>
        </div>
      )}
    </div>
  );
}