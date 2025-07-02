'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMapStore } from '@/store/mapStore';
import { GeoDataService } from '@/services/geoDataService';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BuildingInfoPanel from '@/components/layout/BuildingInfoPanel';
import ZoomControls from '@/components/controls/ZoomControls';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/20">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading map...</span>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const { 
    setGeoJsonData, 
    setLoading, 
    setError, 
    isLoading, 
    error 
  } = useMapStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await GeoDataService.fetchGeoJSONData();
        setGeoJsonData(data);
      } catch (err) {
        console.error('Failed to load GeoJSON data:', err);
        setError('Failed to load map data. Please refresh the page to try again.');
      } finally {
        setLoading(false);
      }
    };

    loadGeoData();
  }, [setGeoJsonData, setLoading, setError]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header onToggleSidebar={toggleSidebar} showMenuButton />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        {/* Main content */}
        <main className="flex-1 relative">
          {error && (
            <Alert className="absolute top-4 left-4 right-4 z-10 bg-destructive/90 border-destructive text-destructive-foreground">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <div className="text-center">
                  <p className="font-medium">Loading GIS Platform</p>
                  <p className="text-sm text-muted-foreground">Initializing spatial data...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <MapComponent />
              
              {/* Building Information Panel */}
              <BuildingInfoPanel />
              
              {/* Floating controls */}
              <div className="absolute top-4 right-4 z-10">
                <ZoomControls />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}