"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Layers } from "lucide-react";
import { Layer } from "@/types/canvas";

interface GlobalSearchProps {
  layers: Record<string, Layer>;
  layerIds: readonly string[] | string[];
  onNavigateToLayer: (layer: Layer) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchProps> = ({
  layers,
  layerIds,
  onNavigateToLayer,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Shortcut Ctrl+F
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = layerIds
    .map((id) => layers[id])
    .filter((l) => l && l.value && l.value.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-xs font-medium transition"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search canvas...</span>
        <kbd className="bg-white border rounded px-1 text-[10px] text-neutral-400">Ctrl+F</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
            <div className="flex items-center gap-2 px-3 border-b border-neutral-200">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search text, notes, flowchart shapes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-11 text-xs outline-none bg-transparent"
              />
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-600 text-xs">
                Esc
              </button>
            </div>

            <div className="overflow-y-auto p-2 space-y-1">
              {query && results.length === 0 ? (
                <div className="text-center text-xs text-neutral-400 py-8">
                  No matching elements found.
                </div>
              ) : (
                results.map((l) => (
                  <div
                    key={l.x + l.y}
                    onClick={() => {
                      onNavigateToLayer(l);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-medium text-neutral-800 group-hover:text-blue-600">
                        {l.value}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
                      <MapPin className="w-3 h-3" /> ({Math.round(l.x)}, {Math.round(l.y)})
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
