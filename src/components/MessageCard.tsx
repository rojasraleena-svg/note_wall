"use client";

import { useEffect, useState } from "react";
import { Message } from "@/types/message";

interface MessageCardProps {
  message: Message;
  onLike: (id: string) => void;
  index?: number;
}

const ROTATIONS = [-1.2, 0.8, -0.6, 1.0, -0.9, 0.5, -1.1, 0.7];

export default function MessageCard({
  message,
  onLike,
  index = 0,
}: MessageCardProps) {
  const [liked, setLiked] = useState(false);
  const [heartbeat, setHeartbeat] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const likedKey = `liked_${message.id}`;
    const storedLiked = localStorage.getItem(likedKey) === "true";

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

  const rotation = ROTATIONS[index % ROTATIONS.length];
  const isPinned = message.is_pinned;
  const animDelay = Math.min(index, 8) * 0.06;

  return (
    <article
      className={`note-card ${isPinned ? "note-card--pinned" : ""}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${animDelay}s`,
      }}
      data-testid="message-card"
    >
      {/* Pinned indicator */}
      {isPinned && (
        <span className="note-card-pin" aria-label="置顶">
          📌
        </span>
      )}

      {/* Main content — the star */}
      <p className="note-card-text">{message.content}</p>

      {/* Bottom meta row */}
      <div className="note-card-meta">
        <div className="note-card-author">
          <img
            src={avatarUrl}
            alt=""
            className="note-card-avatar"
            loading="lazy"
          />
          <span className="note-card-name">{message.nickname}</span>
          <span className="note-card-time">{formatDate(message.created_at)}</span>
        </div>

        <button
          onClick={handleLike}
          disabled={liked}
          className={`note-card-like ${liked ? "note-card-like--active" : ""}`}
          data-testid="like-button"
          aria-label={liked ? "已点赞" : "点赞"}
        >
          <span className={heartbeat ? "animate-like-heartbeat" : ""}>
            {liked ? "♥" : "♡"}
          </span>
          <span data-testid="like-count">{message.likes}</span>
        </button>
      </div>
    </article>
  );
}
