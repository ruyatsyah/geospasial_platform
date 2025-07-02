"use client";

import { X, MapPin, Trash2, Building, BarChart3 } from "lucide-react";
import { useMapStore } from "@/store/mapStore";
import { GeoDataService } from "@/services/geoDataService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function BuildingInfoPanel() {
  const { selectedFeature, setSelectedFeature } = useMapStore();

  if (!selectedFeature) return null;

  const totalWaste = GeoDataService.calculateWasteIntensity(selectedFeature);
  const wasteColor = GeoDataService.getWasteColor(totalWaste);

  const getWasteLevel = (waste: number) => {
    if (waste <= 10)
      return { level: "Low", color: "bg-green-100 text-green-800" };
    if (waste <= 20)
      return { level: "Medium", color: "bg-yellow-100 text-yellow-800" };
    if (waste <= 30)
      return { level: "High", color: "bg-orange-100 text-orange-800" };
    return { level: "Critical", color: "bg-red-100 text-red-800" };
  };

  const wasteLevel = getWasteLevel(totalWaste);

  const closePanel = () => {
    setSelectedFeature(null);
  };

  return (
    <div className="absolute top-4 left-4 z-20 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <Card className="bg-background/95 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full ring-2 ring-white/50"
                style={{ backgroundColor: wasteColor }}
              />
              <CardTitle className="text-lg text-blue-600">
                {selectedFeature.properties.RTNew}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closePanel}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              ID: {selectedFeature.properties.Id}
            </Badge>
            <Badge className={cn("text-xs", wasteLevel.color)}>
              {wasteLevel.level} Waste
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Building Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Building Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Area</p>
                <p className="font-medium">
                  {selectedFeature.properties.Shape_Area.toFixed(2)} m²
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">
                  {selectedFeature.properties.RTNew}
                </p>
              </div>
            </div>
          </div>

          {/* Waste Analysis */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Waste Analysis</h3>
            </div>

            <div className="space-y-2">
              {/* Total Waste */}
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Waste</span>
                  <span
                    className="font-bold text-lg"
                    style={{ color: wasteColor }}
                  >
                    {totalWaste} kg
                  </span>
                </div>
              </div>

              {/* Waste Breakdown */}
              <div className="space-y-2">
                {[
                  {
                    label: "Plastic Waste",
                    colorClass: "bg-green-500",
                    bgClass: "bg-green-50 dark:bg-green-950/30",
                    value:
                      selectedFeature.properties["Sampah Plastik (kg)"] ?? 0,
                  },
                  {
                    label: "Organic Waste",
                    colorClass: "bg-orange-500",
                    bgClass: "bg-orange-50 dark:bg-orange-950/30",
                    value:
                      selectedFeature.properties["Sampah Organik (kg)"] ?? 0,
                  },
                  {
                    label: "Anorganic Waste",
                    colorClass: "bg-gray-500",
                    bgClass: "bg-gray-50 dark:bg-gray-950/30",
                    value:
                      selectedFeature.properties["Sampah Anorganik (kg)"] ??
                      selectedFeature.properties["sampah Anorganik (kg)"] ??
                      0,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-2 ${item.bgClass} rounded`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${item.colorClass}`}
                      ></div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="font-medium">{item.value} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Waste Distribution Chart */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Waste Distribution</h3>
            </div>

            <div className="space-y-2">
              {[
                {
                  type: "Plastic",
                  value: selectedFeature.properties["Sampah Plastik (kg)"] ?? 0,
                  color: "#22c55e",
                },
                {
                  type: "Organic",
                  value: selectedFeature.properties["Sampah Organik (kg)"] ?? 0,
                  color: "#f97316",
                },
                {
                  type: "Anorganic",
                  value:
                    selectedFeature.properties["Sampah Anorganik (kg)"] ??
                    selectedFeature.properties["sampah Anorganik (kg)"] ??
                    0,
                  color: "#6b7280",
                },
              ].map((item) => {
                const percentage =
                  totalWaste > 0
                    ? ((item.value / totalWaste) * 100).toFixed(1)
                    : "0.0";
                return (
                  <div key={item.type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.type}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Location Details</h3>
            </div>

            <div className="bg-muted/20 p-3 rounded-lg text-sm">
              <p>
                <strong>Region:</strong> {selectedFeature.properties.RTNew}
              </p>
              <p>
                <strong>Building ID:</strong> {selectedFeature.properties.Id}
              </p>
              <p>
                <strong>Coordinates:</strong> Available in geometry data
              </p>
              <p className="text-muted-foreground mt-2">
                This building is located in the{" "}
                {selectedFeature.properties.RTNew} area with a total area of{" "}
                {selectedFeature.properties.Shape_Area.toFixed(2)} square
                meters.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
