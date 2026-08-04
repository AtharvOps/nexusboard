"use client";

import React, { useState } from "react";
import { SpatialComment, Camera } from "@/types/canvas";
import { MessageSquare, CheckCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpatialCommentsProps {
  comments: SpatialComment[];
  camera: Camera;
  onAddReply: (commentId: string, replyText: string) => void;
  onToggleResolve: (commentId: string) => void;
}

export const SpatialCommentsOverlay: React.FC<SpatialCommentsProps> = ({
  comments,
  camera,
  onAddReply,
  onToggleResolve,
}) => {
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");

  const activeComment = comments.find((c) => c.id === activeCommentId);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentId || !replyInput.trim()) return;
    onAddReply(activeCommentId, replyInput.trim());
    setReplyInput("");
  };

  return (
    <>
      {/* Comment Pins rendered at canvas coordinates */}
      {comments.map((comment) => {
        if (comment.resolved) return null;
        const screenX = comment.x + camera.x;
        const screenY = comment.y + camera.y;

        return (
          <div
            key={comment.id}
            onClick={(e) => {
              e.stopPropagation();
              setActiveCommentId(comment.id);
            }}
            className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${screenX}px`, top: `${screenY}px` }}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center font-bold text-xs hover:scale-110 transition border-2 border-white">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
        );
      })}

      {/* Floating Active Thread Popup */}
      {activeComment && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-40 w-72 bg-white rounded-xl shadow-2xl border border-neutral-200 p-3 select-none text-xs flex flex-col gap-2"
          style={{
            left: `${Math.min(window.innerWidth - 300, Math.max(20, activeComment.x + camera.x + 20))}px`,
            top: `${Math.min(window.innerHeight - 300, Math.max(20, activeComment.y + camera.y - 10))}px`,
          }}
        >
          {/* Thread Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                {activeComment.authorName[0] || "U"}
              </div>
              <span className="font-semibold text-neutral-800">
                {activeComment.authorName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleResolve(activeComment.id)}
                className="text-neutral-400 hover:text-green-600 p-1"
                title="Mark as Resolved"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveCommentId(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comment Content */}
          <p className="text-neutral-700 text-xs py-1 font-normal">
            {activeComment.content}
          </p>

          {/* Reply List */}
          {activeComment.replies && activeComment.replies.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-100 max-h-36 overflow-y-auto">
              {activeComment.replies.map((r) => (
                <div key={r.id} className="bg-neutral-50 p-2 rounded-lg">
                  <div className="font-semibold text-[10px] text-neutral-600">
                    {r.authorName}
                  </div>
                  <div className="text-neutral-700 text-xs">{r.content}</div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleReplySubmit} className="flex gap-1 pt-2">
            <input
              type="text"
              placeholder="Reply or @mention..."
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              className="flex-1 h-7 px-2 border rounded-lg text-xs outline-none focus:border-blue-500"
            />
            <Button type="submit" size="icon" className="h-7 w-7 bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
