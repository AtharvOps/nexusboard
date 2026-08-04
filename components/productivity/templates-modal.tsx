"use client";

import React, { useState } from "react";
import { Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplatesModalProps {
  onSelectTemplate: (templateName: string) => void;
}

const TEMPLATES = [
  { id: "kanban", title: "Kanban Board", desc: "To-Do, In Progress, Done columns with sticky notes" },
  { id: "wireframe", title: "App Wireframe", desc: "Mobile screen layout with header, cards & bottom bar" },
  { id: "user-journey", title: "User Journey Map", desc: "Stages, Actions, Feelings, Pain Points grid" },
  { id: "mindmap", title: "Mind Map", desc: "Central topic node surrounded by branch nodes" },
  { id: "retro", title: "Sprint Retro", desc: "What Went Well, To Improve, Action Items" },
  { id: "swot", title: "SWOT Analysis", desc: "Strengths, Weaknesses, Opportunities, Threats" },
  { id: "org-chart", title: "Org Chart", desc: "Hierarchical team structure diagram" },
  { id: "flowchart", title: "Process Flowchart", desc: "Start, Decision, Process steps with connectors" },
];

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  onSelectTemplate,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 text-xs text-neutral-700 hover:bg-neutral-100 font-medium"
      >
        <Layout className="w-3.5 h-3.5" /> Templates
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
                <Layout className="w-4 h-4 text-blue-600" /> Board Templates
              </div>
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTemplate(t.id);
                    setOpen(false);
                  }}
                  className="p-3 border border-neutral-200 rounded-xl hover:border-blue-500 hover:shadow-md cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="font-semibold text-neutral-800 group-hover:text-blue-600 text-xs">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-1">
                      {t.desc}
                    </div>
                  </div>
                  <div className="text-blue-600 font-medium text-[10px] pt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    Use Template →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
