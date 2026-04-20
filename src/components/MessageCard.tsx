"use client";

import { useEffect, useState } from "react";
import { Message } from "@/types/message";

interface MessageCardProps {
  message: Message;
  onLike: (id: string) => void;
  index?: number;
}

export default function MessageCard({
  message,
  onLike,
}: MessageCardProps) {
  const [liked, setLiked] = useState(false);
  const [heartbeat, setHeartbeat] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const likedKey = `liked_${message.id}`;
    const storedLiked = localStorage.getItem(likedKey) === "true";

    // Guard against stale local state such as old failed likes or reset data.
    if (storedLiked && message.likes === 0) {
      localStorage.removeItem(likedKey);
      setLiked(false);
      return;
    }

    setLiked(storedLiked);
  }, [message.id, message.likes]);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setHeartbeat(true);
    onLike(message.id);
    window.setTimeout(() => setHeartbeat(false), 600);
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

  const isPopular = message.likes >= 10;

  const cardClasses = [
    "note-card",
    "rounded-[1.2rem]",
    "animate-fade-in-up",
    message.is_pinned ? "card-pinned" : "",
    isPopular ? "card-popular" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClasses} data-testid="message-card">
      <div className="note-card-inner">
        <div className="note-card-top">
          <div className="note-card-profile">
            <img
              src={avatarUrl}
              alt={message.nickname}
              className="h-10 w-10 rounded-full border border-[rgba(19,17,15,0.08)] bg-[rgba(255,255,255,0.5)]"
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
              <span className="note-badge note-badge-accent">置顶</span>
            )}
            {isPopular && <span className="note-badge">较热</span>}
          </div>
        </div>

        <p className="note-card-body">{message.content}</p>

        <div className="note-card-footer">
          <span className="note-card-label">公开留言</span>
          <button
            onClick={handleLike}
            disabled={liked}
            className={`like-btn note-like-button ${
              liked
                ? "bg-[rgba(211,93,49,0.08)] text-[var(--color-accent)]"
                : "text-[var(--color-soft)] hover:bg-[rgba(19,17,15,0.05)] hover:text-[var(--color-ink)]"
            }`}
            data-testid="like-button"
            aria-label={liked ? "已点赞" : "点赞"}
          >
            <span className={`${heartbeat ? "animate-like-heartbeat" : ""}`}>
              {liked ? "♥" : "♡"}
            </span>
            <span className="text-xs font-semibold" data-testid="like-count">
              {message.likes}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
