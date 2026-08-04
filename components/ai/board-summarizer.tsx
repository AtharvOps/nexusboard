"use client";

import React, { useState } from "react";
import { FileText, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layer } from "@/types/canvas";

interface BoardSummarizerProps {
  layers: Record<string, Layer>;
}

export const BoardSummarizer: React.FC<BoardSummarizerProps> = ({ layers }) => {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSummary = () => {
    const textValues = Object.values(layers)
      .map((l) => l.value)
      .filter(Boolean);

    const generated = `📌 Board Executive Summary

🎯 Key Points:
- ${textValues[0] || "Brainstormed feature architecture & flowchart layout."}
- ${textValues[1] || "Reviewed collaboration & spatial voice controls."}

✅ Decisions Made:
- Adopted vector flowchart shapes and smart orthogonal routing.
- Enabled persistent board version history checkpoints.

⚠️ Identified Risks:
- Monitor Liveblocks storage performance with 10,000+ objects.

🚀 Next Steps:
- Execute final automated linting & production build.`;

    setSummary(generated);
    setOpen(true);
  };

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={generateSummary}
        className="h-8 gap-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-medium"
      >
        <FileText className="w-3.5 h-3.5" /> Summarize Board
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Board AI Summary
              </div>
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                ✕
              </button>
            </div>

            <pre className="bg-neutral-50 p-4 rounded-lg text-xs font-mono text-neutral-800 whitespace-pre-wrap leading-relaxed border border-neutral-200 max-h-80 overflow-y-auto">
              {summary}
            </pre>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-1.5 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Summary"}
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
