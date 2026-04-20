"use client";

import { useEffect, useState, useCallback } from "react";
import { Message } from "@/types/message";
import {
  fetchMessages,
  createMessage,
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
  const pinnedCount = messages.filter((message) => message.is_pinned).length;
  const highlightedLikes = messages.reduce(
    (max, message) => Math.max(max, message.likes),
    0
  );

  return (
    <section className="notes-layout">
      <aside>
        <div className="notes-panel rounded-[2rem]">
          <div className="eyebrow">Write / archive / revisit</div>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.8rem)] leading-[0.95] tracking-[-0.06em] display-font">
            像编辑墙一样，把内容排成能被重新看见的版面。
          </h2>
          <p className="section-copy mt-4">
            这里不再是普通卡片列表，而更像一个不断更新的公共展板。每条留言保留它自己的呼吸感，
            你写下的内容会先被看见，再被阅读。
          </p>

          <div className="stats-grid">
            <div className="stat-box">
              <strong>{total}</strong>
              <span>公开留言</span>
            </div>
            <div className="stat-box">
              <strong>{pinnedCount}</strong>
              <span>置顶内容</span>
            </div>
            <div className="stat-box">
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

      <div className="feed-panel rounded-[2rem]">
        <div className="feed-head">
          <div>
            <div className="feed-kicker">Public wall</div>
            <h3 className="feed-title display-font">Latest notes</h3>
            <p className="feed-subtitle">
              置顶内容会先出现，后面的留言按时间倒序排布。滚动时你看到的不是一组卡片，
              而是一面持续更新的纸质墙。
            </p>
          </div>
          <div className="feed-count">
            <span className="feed-kicker">Entries now</span>
            <strong>{total}</strong>
          </div>
        </div>

        {loading && page === 1 ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p className="text-sm text-[var(--color-soft)]">
              正在从数据库整理最新留言...
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
            <p className="text-4xl display-font">First note wanted</p>
            <p className="mt-3 text-sm text-[var(--color-soft)]">
              这里还没有内容。把第一条留言贴上去，让这面墙真正开始发声。
            </p>
          </div>
        ) : (
          <>
            <div className="feed-columns">
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
                    "继续加载更多"
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
