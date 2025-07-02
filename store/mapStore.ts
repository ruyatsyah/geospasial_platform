import { create } from 'zustand';

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    Id: number;
    Shape_Leng: number;
    Shape_Area: number;
    Estimasi: number;
    RTNew: string;
    'Sampah Plastik (kg)': number;
    'Sampah Organik (kg)': number;
    'Sampah Anorganik (kg)': number;
  };
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  name: string;
  features: GeoJSONFeature[];
}

export type BaseMapStyle = 'light' | 'dark' | 'satellite';

interface MapState {
  geoJsonData: GeoJSONData | null;
  selectedFeature: GeoJSONFeature | null;
  highlightedFeature: GeoJSONFeature | null;
  showBuildings: boolean;
  baseMapStyle: BaseMapStyle;
  searchQuery: string;
  mapCenter: [number, number];
  mapZoom: number;
  isLoading: boolean;
  error: string | null;
}

interface MapActions {
  setGeoJsonData: (data: GeoJSONData) => void;
  setSelectedFeature: (feature: GeoJSONFeature | null) => void;
  setHighlightedFeature: (feature: GeoJSONFeature | null) => void;
  toggleBuildings: () => void;
  setBaseMapStyle: (style: BaseMapStyle) => void;
  setSearchQuery: (query: string) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearHighlight: () => void;
}

export const useMapStore = create<MapState & MapActions>((set) => ({
  geoJsonData: null,
  selectedFeature: null,
  highlightedFeature: null,
  showBuildings: true,
  baseMapStyle: 'dark',
  searchQuery: '',
  mapCenter: [-6.9793, 107.5896], // Corrected coordinates for Indonesia (lat, lng)
  mapZoom: 18,
  isLoading: false,
  error: null,

  setGeoJsonData: (data) => set({ geoJsonData: data }),
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
  setHighlightedFeature: (feature) => set({ highlightedFeature: feature }),
  toggleBuildings: () => set((state) => ({ showBuildings: !state.showBuildings })),
  setBaseMapStyle: (style) => set({ baseMapStyle: style }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearHighlight: () => set({ highlightedFeature: null }),
}));