"use client";

import React, { useState } from "react";
import { History, Plus, RotateCcw, Clock, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardVersion } from "@/types/canvas";

interface VersionHistoryProps {
  versions: BoardVersion[];
  onCreateCheckpoint: (name: string) => void;
  onRestoreVersion: (version: BoardVersion) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryProps> = ({
  versions,
  onCreateCheckpoint,
  onRestoreVersion,
}) => {
  const [open, setOpen] = useState(false);
  const [checkpointName, setCheckpointName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkpointName.trim()) return;
    onCreateCheckpoint(checkpointName.trim());
    setCheckpointName("");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 text-xs text-neutral-700 hover:bg-neutral-100 font-medium"
      >
        <History className="w-3.5 h-3.5" /> History
      </Button>

      {open && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-neutral-200 z-50 p-4 flex flex-col justify-between animate-in slide-in-from-right">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
                <History className="w-4 h-4 text-blue-600" /> Version History
              </div>
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                ✕
              </button>
            </div>

            {/* Create Checkpoint Form */}
            <form onSubmit={handleCreate} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Checkpoint name..."
                value={checkpointName}
                onChange={(e) => setCheckpointName(e.target.value)}
                className="flex-1 h-8 px-2 border rounded-lg text-xs outline-none focus:border-blue-500"
              />
              <Button type="submit" size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs">
                <Plus className="w-3.5 h-3.5" /> Save
              </Button>
            </form>

            {/* Timeline */}
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {versions.length === 0 ? (
                <div className="text-center text-xs text-neutral-400 py-8">
                  No named checkpoints yet. Create one above!
                </div>
              ) : (
                versions.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 border border-neutral-200 rounded-lg hover:border-blue-500 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-xs text-neutral-800 flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-blue-500" /> {v.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1 pt-0.5">
                        <Clock className="w-2.5 h-2.5" />{" "}
                        {new Date(v.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRestoreVersion(v)}
                      className="h-7 text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </Button>
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
