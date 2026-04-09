"use client";

import { useState } from "react";
import { Message } from "@/types/message";

interface MessageCardProps {
  message: Message;
  onLike: (id: string) => void;
}

export default function MessageCard({ message, onLike }: MessageCardProps) {
  const [liked, setLiked] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(`liked_${message.id}`);
    }
    return false;
  });

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    onLike(message.id);
  };

  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${message.avatar_seed}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
      data-testid="message-card"
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatarUrl}
          alt={message.nickname}
          className="w-10 h-10 rounded-full bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">
            {message.nickname}
          </p>
          <p className="text-xs text-gray-400">
            {formatDate(message.created_at)}
          </p>
        </div>
        {message.is_pinned && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
            置顶
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {message.content}
      </p>
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-1 text-sm transition-colors ${
            liked
              ? "text-red-400 cursor-not-allowed"
              : "text-gray-400 hover:text-red-400"
          }`}
          data-testid="like-button"
        >
          <span>{liked ? "❤️" : "🤍"}</span>
          <span data-testid="like-count">{message.likes}</span>
        </button>
      </div>
    </div>
  );
}
