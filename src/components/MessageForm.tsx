"use client";

import { useState, FormEvent } from "react";

interface MessageFormProps {
  onSubmit: (nickname: string, content: string) => Promise<void>;
  submitting: boolean;
}

export default function MessageForm({ onSubmit, submitting }: MessageFormProps) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("留言内容不能为空");
      return;
    }
    if (trimmedContent.length > 500) {
      setError("留言内容不能超过500字");
      return;
    }

    try {
      await onSubmit(nickname.trim(), trimmedContent);
      setContent("");
      setError("");
    } catch {
      setError("发布失败，请稍后重试");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      data-testid="message-form"
    >
      <div className="mb-4">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="昵称（选填，默认匿名用户）"
          maxLength={50}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          data-testid="nickname-input"
        />
      </div>
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的留言..."
          maxLength={500}
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
          data-testid="content-input"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {content.length}/500
        </p>
      </div>
      {error && (
        <p className="text-red-500 text-sm mb-3" data-testid="form-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        data-testid="submit-button"
      >
        {submitting ? "发布中..." : "发布留言"}
      </button>
    </form>
  );
}
