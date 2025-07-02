'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore, GeoJSONFeature } from '@/store/mapStore';
import { GeoDataService } from '@/services/geoDataService';
import { cn } from '@/lib/utils';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater() {
  const map = useMap();
  const { mapCenter, mapZoom } = useMapStore();

  useEffect(() => {
    map.setView(mapCenter, mapZoom);
  }, [map, mapCenter, mapZoom]);

  return null;
}

function GeoJSONLayer() {
  const { 
    geoJsonData, 
    showBuildings, 
    setSelectedFeature, 
    highlightedFeature,
    selectedFeature 
  } = useMapStore();
  const geoJsonRef = useRef<L.GeoJSON>(null);

  const getFeatureStyle = (feature: GeoJSONFeature) => {
    const totalWaste = GeoDataService.calculateWasteIntensity(feature);
    const baseColor = GeoDataService.getWasteColor(totalWaste);
    
    // Check if this feature is highlighted or selected
    const isHighlighted = highlightedFeature?.properties.Id === feature.properties.Id;
    const isSelected = selectedFeature?.properties.Id === feature.properties.Id;
    
    if (isHighlighted || isSelected) {
      return {
        fillColor: baseColor,
        weight: 5,
        opacity: 1,
        color: '#ffffff',
        dashArray: '',
        fillOpacity: 0.9,
        className: 'highlighted-feature'
      };
    }
    
    return {
      fillColor: baseColor,
      weight: 2,
      opacity: 1,
      color: '#ffffff',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: GeoJSONFeature, layer: L.Layer) => {
    // Apply initial style
    if (layer instanceof L.Path) {
      layer.setStyle(getFeatureStyle(feature));
    }

    // Add click event - directly show description panel instead of popup
    layer.on('click', (e) => {
      // Prevent event bubbling
      L.DomEvent.stopPropagation(e);
      setSelectedFeature(feature);
    });

    // Add hover effects only for non-highlighted features
    layer.on('mouseover', () => {
      const isHighlighted = highlightedFeature?.properties.Id === feature.properties.Id;
      const isSelected = selectedFeature?.properties.Id === feature.properties.Id;
      
      if (!isHighlighted && !isSelected && layer instanceof L.Path) {
        layer.setStyle({
          weight: 4,
          color: '#ffffff',
          dashArray: '',
          fillOpacity: 0.9,
        });
      }
    });

    layer.on('mouseout', () => {
      if (layer instanceof L.Path) {
        layer.setStyle(getFeatureStyle(feature));
      }
    });
  };

  // Update styles when highlighted or selected feature changes
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer) => {
        if (layer instanceof L.Path && (layer as any).feature) {
          const feature = (layer as any).feature as GeoJSONFeature;
          layer.setStyle(getFeatureStyle(feature));
        }
      });
    }
  }, [highlightedFeature, selectedFeature]);

  if (!geoJsonData || !showBuildings) return null;

  return (
    <GeoJSON
      ref={geoJsonRef}
      data={geoJsonData}
      onEachFeature={onEachFeature}
      key={`${highlightedFeature?.properties.Id}-${selectedFeature?.properties.Id}`}
    />
  );
}

export default function MapComponent() {
  const { baseMapStyle, mapCenter, mapZoom } = useMapStore();

  const getTileLayerUrl = () => {
    switch (baseMapStyle) {
      case 'light':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'dark':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (baseMapStyle) {
      case 'light':
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      case 'dark':
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
      case 'satellite':
        return 'Tiles &copy; Esri';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className={cn(
          "w-full h-full z-0",
          "leaflet-container"
        )}
        zoomControl={false}
      >
        <TileLayer
          url={getTileLayerUrl()}
          attribution={getTileLayerAttribution()}
        />
        <GeoJSONLayer />
        <MapUpdater />
      </MapContainer>
    </div>
  );
}