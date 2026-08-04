"use client";

import React from "react";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyClusteringProps {
  onClusterNotes: () => void;
}

export const StickyClusteringButton: React.FC<StickyClusteringProps> = ({
  onClusterNotes,
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClusterNotes}
      className="h-8 gap-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 font-medium"
      title="Cluster Sticky Notes by Topic"
    >
      <LayoutGrid className="w-3.5 h-3.5 text-amber-600" /> Cluster Notes
    </Button>
  );
};
