import { GeoJSONData } from '@/store/mapStore';

export class GeoDataService {
  static async fetchGeoJSONData(): Promise<GeoJSONData> {
    try {
      const response = await fetch('/dummy-data-for-test.geojson');
      if (!response.ok) {
        throw new Error(`Failed to fetch GeoJSON data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error);
      throw error;
    }
  }

  static calculateWasteIntensity(feature: any): number {
    const plasticWaste = feature.properties['Sampah Plastik (kg)'] || 0;
    const organicWaste = feature.properties['Sampah Organik (kg)'] || 0;
    const anorganicWaste = feature.properties['Sampah Anorganik (kg)'] || 0;
    
    return plasticWaste + organicWaste + anorganicWaste;
  }

  static getWasteColor(totalWaste: number): string {
    if (totalWaste <= 10) return '#22c55e'; // Green - Low waste
    if (totalWaste <= 20) return '#eab308'; // Yellow - Medium waste
    if (totalWaste <= 30) return '#f97316'; // Orange - High waste
    return '#ef4444'; // Red - Very high waste
  }

  static searchFeatures(data: GeoJSONData | null, query: string) {
    if (!data || !query) return [];
    
    return data.features.filter(feature => 
      feature.properties.RTNew.toLowerCase().includes(query.toLowerCase()) ||
      feature.properties.Id.toString().includes(query)
    );
  }
}