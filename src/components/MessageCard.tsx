"use client";

import { useState, useRef, useCallback } from "react";
import { Message } from "@/types/message";

interface MessageCardProps {
  message: Message;
  onLike: (id: string) => void;
  index?: number;
}

export default function MessageCard({ message, onLike, index = 0 }: MessageCardProps) {
  const [liked, setLiked] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(`liked_${message.id}`);
    }
    return false;
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [heartbeat, setHeartbeat] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({});
  }, []);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setHeartbeat(true);
    onLike(message.id);
    setTimeout(() => setHeartbeat(false), 600);
  };

  const avatarUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${message.avatar_seed}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const animationDelay = `${Math.min(index * 0.05, 0.3)}s`;
  const isPopular = message.likes >= 10;

  const cardClasses = [
    "glass-card",
    "rounded-2xl",
    "p-5",
    "animate-fade-in-up",
    message.is_pinned ? "card-pinned" : "",
    isPopular ? "card-popular" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      style={{ animationDelay, ...tiltStyle }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-testid="message-card"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img
            src={avatarUrl}
            alt={message.nickname}
            className="w-10 h-10 rounded-full bg-white/50"
          />
          {message.is_pinned && (
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-yellow-400 rounded-full text-[8px]">
              📌
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">
            {message.nickname}
          </p>
          <p className="text-xs text-gray-400">
            {formatDate(message.created_at)}
          </p>
        </div>
        {message.is_pinned && (
          <span className="text-[10px] bg-yellow-100/80 text-yellow-700 px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
            置顶
          </span>
        )}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words mb-3">
        {message.content}
      </p>
      <div className="flex justify-end">
        <button
          onClick={handleLike}
          disabled={liked}
          className={`like-btn flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full ${
            liked
              ? "text-rose-400 cursor-default"
              : "text-gray-400 hover:text-rose-400 hover:bg-rose-50/50"
          }`}
          data-testid="like-button"
        >
          <span className={`text-base ${heartbeat ? "animate-like-heartbeat" : ""}`}>{liked ? "❤️" : "🤍"}</span>
          <span className="text-xs font-medium" data-testid="like-count">
            {message.likes}
          </span>
        </button>
      </div>
    </div>
  );
}
