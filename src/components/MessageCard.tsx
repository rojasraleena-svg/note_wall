"use client";

import { useState, useRef, useCallback } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { Message } from "@/types/message";

interface MessageCardProps {
  message: Message;
  onLike: (id: string) => void;
  index?: number;
}

export default function MessageCard({
  message,
  onLike,
  index = 0,
}: MessageCardProps) {
  const [liked, setLiked] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(`liked_${message.id}`);
    }
    return false;
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({});
  const [heartbeat, setHeartbeat] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 4;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
      perspective: "1000px",
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
  const noteRotation = `${((index % 4) - 1.5) * 1.4}deg`;

  const cardClasses = [
    "note-card",
    "rounded-[1.6rem]",
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
      style={
        {
          animationDelay,
          ...tiltStyle,
          "--note-rotate": noteRotation,
        } as CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-testid="message-card"
    >
      <div className="note-card-inner">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={avatarUrl}
              alt={message.nickname}
              className="h-11 w-11 rounded-full border border-[rgba(19,17,15,0.08)] bg-[rgba(255,255,255,0.5)]"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                {message.nickname}
              </p>
              <p className="text-xs text-[var(--color-soft)]">
                {formatDate(message.created_at)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {message.is_pinned && (
              <span className="inline-flex items-center rounded-full border border-[rgba(211,93,49,0.16)] bg-[rgba(211,93,49,0.08)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                置顶
              </span>
            )}
            {isPopular && (
              <span className="inline-flex items-center rounded-full border border-[rgba(247,198,106,0.28)] bg-[rgba(247,198,106,0.16)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b5a10]">
                Popular
              </span>
            )}
          </div>
        </div>

        <p className="mb-5 whitespace-pre-wrap break-words text-[15px] leading-7 text-[var(--color-muted)]">
          {message.content}
        </p>

        <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-soft)]">
            Open entry
          </span>
          <button
            onClick={handleLike}
            disabled={liked}
            className={`like-btn inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${
              liked
                ? "cursor-default bg-[rgba(211,93,49,0.08)] text-[var(--color-accent)]"
                : "text-[var(--color-soft)] hover:bg-[rgba(19,17,15,0.05)] hover:text-[var(--color-ink)]"
            }`}
            data-testid="like-button"
          >
            <span className={`${heartbeat ? "animate-like-heartbeat" : ""}`}>
              {liked ? "♥" : "♡"}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              Appreciate
            </span>
            <span className="text-xs font-semibold" data-testid="like-count">
              {message.likes}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
