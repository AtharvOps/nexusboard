"use client";

import React, { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Download, FileCode, FileImage, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportModalProps {
  onExport: (format: "png" | "transparent-png" | "svg" | "pdf", scale: number) => void;
}

const emptySubscribe = () => () => {};

export const ExportModal: React.FC<ExportModalProps> = ({ onExport }) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(2);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const handleRunExport = (format: "png" | "transparent-png" | "svg" | "pdf") => {
    onExport(format, scale);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 text-xs text-neutral-700 hover:bg-neutral-100 font-medium px-2.5"
      >
        <Download className="w-4 h-4 text-blue-600" />
        <span>Export</span>
      </Button>

      {open && mounted && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[99999] flex justify-end animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          {/* Right-Side Full Height Export Drawer Panel */}
          <div 
            className="bg-white h-full w-full max-w-sm sm:max-w-md shadow-2xl border-l border-neutral-200 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-y-auto pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2.5 font-bold text-neutral-900 text-lg">
                  <div className="p-2.5 rounded-xl bg-blue-100/80 text-blue-600">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-neutral-900">Export Board</div>
                    <div className="text-xs font-normal text-neutral-500">Download canvas in high resolution</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Resolution Multiplier Selector */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Quality & Resolution
                </label>
                <div className="grid grid-cols-3 gap-2 bg-neutral-100/90 p-1.5 rounded-xl border border-neutral-200">
                  {[
                    { label: "1x Standard", val: 1 },
                    { label: "2x High-DPI", val: 2 },
                    { label: "3x Ultra-HD", val: 3 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setScale(item.val)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium transition flex flex-col items-center gap-0.5 ${
                        scale === item.val
                          ? "bg-blue-600 text-white shadow-md font-bold"
                          : "bg-transparent text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      <span>{item.val}x Scale</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Formats List */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Select Format
                </label>

                <div className="grid grid-cols-1 gap-3">
                  {/* PNG Image */}
                  <button
                    onClick={() => handleRunExport("png")}
                    className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:bg-blue-50/50 transition flex items-center justify-between text-left group bg-white shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                        <FileImage className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-800">PNG Image</div>
                        <div className="text-xs text-neutral-500">Raster image with background</div>
                      </div>
                    </div>
                  </button>

                  {/* Transparent PNG */}
                  <button
                    onClick={() => handleRunExport("transparent-png")}
                    className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-purple-500 hover:bg-purple-50/50 transition flex items-center justify-between text-left group bg-white shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                        <FileImage className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-800">Transparent PNG</div>
                        <div className="text-xs text-neutral-500">Transparent background cutout</div>
                      </div>
                    </div>
                  </button>

                  {/* SVG Vector */}
                  <button
                    onClick={() => handleRunExport("svg")}
                    className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition flex items-center justify-between text-left group bg-white shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-800">SVG Vector</div>
                        <div className="text-xs text-neutral-500">Scalable vector graphics file</div>
                      </div>
                    </div>
                  </button>

                  {/* PDF Document */}
                  <button
                    onClick={() => handleRunExport("pdf")}
                    className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-red-500 hover:bg-red-50/50 transition flex items-center justify-between text-left group bg-white shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-800">PDF Document</div>
                        <div className="text-xs text-neutral-500">High resolution PDF export</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-neutral-400 text-center pt-4 border-t border-neutral-100 font-medium">
              NexusBoard Export Engine • High Resolution Render
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
