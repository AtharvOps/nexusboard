"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LayerType } from "@/types/canvas";

interface AIDiagramGeneratorProps {
  onInsertDiagram: (
    nodes: Array<{
      type: LayerType;
      x: number;
      y: number;
      width: number;
      height: number;
      fill: { r: number; g: number; b: number };
      value: string;
    }>,
    connectors: Array<{
      startIdx: number;
      endIdx: number;
    }>
  ) => void;
}

export const AIDiagramGenerator: React.FC<AIDiagramGeneratorProps> = ({
  onInsertDiagram,
}) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);

    setTimeout(() => {
      // Intelligently parse prompt keywords to construct flowcharts, mindmaps, or architecture diagrams
      const lower = prompt.toLowerCase();
      const nodes = [];
      const connectors = [];

      if (lower.includes("user") || lower.includes("login") || lower.includes("auth")) {
        nodes.push(
          { type: LayerType.Capsule, x: 100, y: 100, width: 140, height: 60, fill: { r: 59, g: 130, b: 246 }, value: "Start" },
          { type: LayerType.Rectangle, x: 100, y: 220, width: 140, height: 70, fill: { r: 243, g: 244, b: 246 }, value: "Enter Credentials" },
          { type: LayerType.Decision, x: 100, y: 350, width: 140, height: 90, fill: { r: 254, g: 240, b: 138 }, value: "Valid?" },
          { type: LayerType.Capsule, x: 300, y: 365, width: 140, height: 60, fill: { r: 34, g: 197, b: 94 }, value: "Dashboard" }
        );
        connectors.push({ startIdx: 0, endIdx: 1 }, { startIdx: 1, endIdx: 2 }, { startIdx: 2, endIdx: 3 });
      } else {
        // Standard flowchart node graph generator
        const terms = prompt.split("->").map((s) => s.trim()).filter(Boolean);
        const list = terms.length > 1 ? terms : ["Input Data", "Process Logic", "Output Result"];
        
        list.forEach((term, i) => {
          nodes.push({
            type: i === 0 || i === list.length - 1 ? LayerType.Capsule : LayerType.Rectangle,
            x: 100 + i * 200,
            y: 200,
            width: 140,
            height: 70,
            fill: i === 0 ? { r: 59, g: 130, b: 246 } : { r: 243, g: 244, b: 246 },
            value: term,
          });
          if (i > 0) connectors.push({ startIdx: i - 1, endIdx: i });
        });
      }

      onInsertDiagram(nodes, connectors);
      setLoading(false);
      setOpen(false);
      setPrompt("");
    }, 600);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 font-medium"
      >
        <Sparkles className="w-3.5 h-3.5" /> Text → Diagram
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
                <Sparkles className="w-4 h-4 text-purple-600" /> Generate AI Diagram
              </div>
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                ✕
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. User login -> Validate credentials -> Dashboard"
              className="w-full h-24 p-2.5 border rounded-lg text-xs outline-none focus:border-purple-500 font-sans"
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
