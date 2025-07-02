'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LayerControls from '@/components/controls/LayerControls';
import BaseMapControls from '@/components/controls/BaseMapControls';
import LegendComponent from '@/components/controls/LegendComponent';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-80 bg-background/95 backdrop-blur-sm",
        "border-r border-border/50 z-50 transform transition-transform duration-300",
        "md:relative md:translate-x-0 md:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Map Controls</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-4rem)]">
          <LayerControls />
          <BaseMapControls />
          <LegendComponent />
        </div>
      </aside>
    </>
  );
}