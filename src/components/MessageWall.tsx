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
  const pageSize = 20;

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchMessages(page, pageSize);
      if (page === 1) {
        setMessages(result.data);
      } else {
        setMessages((prev) => [...prev, ...result.data]);
      }
      setTotal(result.total);
    } catch (err) {
      console.error("Failed to load messages:", err);
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
      const newMessage = await createMessage({ nickname, content });
      setMessages((prev) => [newMessage, ...prev]);
      setTotal((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to create message:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (messageId: string) => {
    const likedKey = `liked_${messageId}`;
    if (localStorage.getItem(likedKey)) return;

    try {
      const newLikes = await incrementLikes(messageId);
      localStorage.setItem(likedKey, "true");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, likes: newLikes } : msg
        )
      );
    } catch (err) {
      console.error("Failed to like message:", err);
    }
  };

  const hasMore = messages.length < total;

  return (
    <div>
      <MessageForm onSubmit={handleSubmit} submitting={submitting} />

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">
          共 <span className="gradient-text font-bold">{total}</span> 条留言
        </p>
      </div>

      <div className="mt-4">
        {loading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin"></div>
            <p className="text-sm text-gray-400">加载中...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3 animate-float">💌</p>
            <p className="text-gray-400 text-sm">
              还没有留言，快来留下第一条吧！
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loading}
                  className="glass px-8 py-2.5 text-sm text-gray-600 rounded-full hover:bg-white/40 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin"></span>
                      加载中...
                    </span>
                  ) : (
                    "加载更多"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
