"use client";

import React, { useState } from "react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmojiReactionProps {
  onSendReaction: (emoji: string) => void;
}

export type ReactionBurst = {
  id: string;
  emoji: string;
  x: number;
  y: number;
};

const EMOJIS = ["👍", "🔥", "❤️", "🚀", "🎉", "💡", "😂"];

export const EmojiReactionPicker: React.FC<EmojiReactionProps> = ({
  onSendReaction,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="h-8 w-8 text-neutral-600 hover:text-neutral-900"
      >
        <Smile className="w-4 h-4" />
      </Button>

      {open && (
        <div className="absolute bottom-10 left-0 bg-white border border-neutral-200 rounded-full shadow-xl p-1.5 flex gap-1 z-50 animate-in zoom-in-95">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSendReaction(emoji);
                setOpen(false);
              }}
              className="w-7 h-7 flex items-center justify-center hover:scale-125 transition text-base"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const EmojiBurstLayer: React.FC<{ bursts: ReactionBurst[] }> = ({
  bursts,
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bursts.map((b) => (
        <div
          key={b.id}
          className="absolute text-3xl animate-float-up opacity-90 transition-all"
          style={{
            left: `${b.x}px`,
            top: `${b.y}px`,
          }}
        >
          {b.emoji}
        </div>
      ))}
    </div>
  );
};
