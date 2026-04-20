"use client";

import { useCallback, useEffect, useState } from "react";
import { Message } from "@/types/message";
import {
  createMessage,
  fetchMessages,
  incrementLikes,
} from "@/services/messageService";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const pageSize = 20;

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");
      const result = await fetchMessages(page, pageSize);
      if (page === 1) {
        setMessages(result.data);
      } else {
        setMessages((prev) => [...prev, ...result.data]);
      }
      setTotal(result.total);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setLoadError("暂时无法读取留言，请稍后刷新重试。");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSubmit = async (nickname: string, content: string) => {
    try {
      setSubmitting(true);
      setActionError("");
      const newMessage = await createMessage({ nickname, content });
      setMessages((prev) => [newMessage, ...prev]);
      setTotal((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to create message:", err);
      setActionError("发布失败，请稍后再试。");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (messageId: string) => {
    const likedKey = `liked_${messageId}`;
    if (localStorage.getItem(likedKey)) return;

    try {
      setActionError("");
      const newLikes = await incrementLikes(messageId);
      localStorage.setItem(likedKey, "true");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, likes: newLikes } : msg
        )
      );
    } catch (err) {
      console.error("Failed to like message:", err);
      setActionError("点赞没有成功，请稍后再试。");
    }
  };

  const hasMore = messages.length < total;
  const highlightedLikes = messages.reduce(
    (max, message) => Math.max(max, message.likes),
    0
  );

  return (
    <section className="notes-layout" id="notes-wall" data-testid="notes-wall">
      <aside className="notes-rail">
        <div className="notes-panel rounded-[1.75rem]">
          <div className="eyebrow">Leave a note</div>
          <h2 className="notes-title display-font">写一句，留一句。</h2>
          <p className="section-copy">把一句心情留在这里。</p>

          <div className="stats-strip">
            <div className="stat-chip">
              <strong>{total}</strong>
              <span>公开留言</span>
            </div>
            <div className="stat-chip">
              <strong>{highlightedLikes}</strong>
              <span>最高点赞</span>
            </div>
          </div>

          <MessageForm onSubmit={handleSubmit} submitting={submitting} />

          {actionError && (
            <p className="mt-4 text-sm text-[var(--color-accent)]">
              {actionError}
            </p>
          )}
        </div>
      </aside>

      <div className="feed-stage">
        <div className="feed-head">
          <div>
            <div className="feed-kicker">Archive</div>
            <h3 className="feed-title display-font">最新留言</h3>
            <p className="feed-subtitle">置顶在前，其余按时间展开。</p>
          </div>
        </div>

        {loading && page === 1 ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p className="text-sm text-[var(--color-soft)]">
              正在整理最新留言...
            </p>
          </div>
        ) : loadError ? (
          <div className="error-state">
            <p className="mb-4 text-base text-[var(--color-accent)]">
              {loadError}
            </p>
            <button
              onClick={() => loadMessages()}
              className="editorial-button rounded-full px-5 py-2 text-sm"
            >
              重新加载
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <p className="text-4xl display-font">还没有留言</p>
            <p className="mt-3 text-sm text-[var(--color-soft)]">
              把第一条贴上来，让这面墙开始说话。
            </p>
          </div>
        ) : (
          <>
            <div className="feed-grid">
              {messages.map((msg, idx) => (
                <MessageCard
                  key={msg.id}
                  message={msg}
                  onLike={handleLike}
                  index={idx}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loading}
                  className="secondary-button rounded-full px-6 py-2.5 text-sm transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="loading-spinner !mb-0 !h-4 !w-4 !border-[1.5px]" />
                      加载中...
                    </span>
                  ) : (
                    "继续查看更多"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
