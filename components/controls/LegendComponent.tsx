'use client';

import { Info, Trash2 } from 'lucide-react';
import { GeoDataService } from '@/services/geoDataService';
import { cn } from '@/lib/utils';

export default function LegendComponent() {
  const wasteCategories = [
    { range: '0-10 kg', color: '#22c55e', label: 'Low', description: 'Minimal waste generation' },
    { range: '11-20 kg', color: '#eab308', label: 'Medium', description: 'Moderate waste levels' },
    { range: '21-30 kg', label: 'High', color: '#f97316', description: 'High waste concentration' },
    { range: '30+ kg', color: '#ef4444', label: 'Critical', description: 'Critical waste levels' },
  ];

  return (
    <div className={cn(
      "bg-background/90 backdrop-blur-sm rounded-lg border border-border/50",
      "p-4 shadow-lg space-y-3 max-w-xs"
    )}>
      <div className="flex items-center space-x-2">
        <Trash2 className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Waste Intensity</h3>
        <Info className="w-3 h-3 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        {wasteCategories.map((category, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-sm border border-border/30 flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{category.label}</span>
                <span className="text-xs text-muted-foreground">{category.range}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          Colors represent total waste per building including plastic, organic, and anorganic waste.
        </p>
      </div>
    </div>
  );
}