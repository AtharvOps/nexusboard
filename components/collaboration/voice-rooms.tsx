"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VoiceRoomsBar: React.FC = () => {
  const [inRoom, setInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Simulated audio activity detection for live feedback
  useEffect(() => {
    if (!inRoom || isMuted) {
      return;
    }
    const interval = setInterval(() => {
      setIsSpeaking(Math.random() > 0.6);
    }, 1500);
    return () => {
      clearInterval(interval);
      setIsSpeaking(false);
    };
  }, [inRoom, isMuted]);

  if (!inRoom) {
    return (
      <Button
        onClick={() => setInRoom(true)}
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
      >
        <Volume2 className="w-3.5 h-3.5" /> Join Voice
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-neutral-900 text-white px-2 py-1 rounded-full shadow-lg text-xs animate-in fade-in">
      <div className="flex items-center gap-1.5 px-1">
        <span
          className={`w-2 h-2 rounded-full ${
            isSpeaking ? "bg-emerald-400 animate-ping" : "bg-emerald-500"
          }`}
        />
        <span className="font-medium text-[11px]">Voice Active</span>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsMuted(!isMuted)}
        className={`h-6 w-6 rounded-full text-white hover:bg-neutral-800 ${
          isMuted ? "bg-red-500 hover:bg-red-600" : ""
        }`}
      >
        {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => setInRoom(false)}
        className="h-6 w-6 rounded-full text-red-400 hover:bg-red-950 hover:text-red-300"
      >
        <PhoneOff className="w-3 h-3" />
      </Button>
    </div>
  );
};
