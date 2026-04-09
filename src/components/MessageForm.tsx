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
  const [expanded, setExpanded] = useState(false);

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
      setExpanded(false);
      setError("");
    } catch {
      setError("发布失败，请稍后重试");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-strong rounded-2xl p-6 transition-all duration-300"
      data-testid="message-form"
    >
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => !expanded && setExpanded(true)}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {nickname.trim() ? nickname.trim()[0].toUpperCase() : "💡"}
        </div>
        {!expanded ? (
          <p className="text-gray-400 text-sm flex-1">写下你的留言...</p>
        ) : (
          <div className="flex-1">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="昵称（选填）"
              maxLength={50}
              className="w-full px-0 py-1 border-0 border-b border-gray-200/50 bg-transparent focus:outline-none focus:border-indigo-300 text-sm text-gray-700 placeholder-gray-300"
              data-testid="nickname-input"
              autoFocus
            />
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-4 animate-fade-in-up">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="说点什么吧..."
            maxLength={500}
            rows={3}
            className="w-full px-0 py-2 border-0 border-b border-gray-200/50 bg-transparent focus:outline-none focus:border-indigo-300 text-sm text-gray-700 placeholder-gray-300 resize-none leading-relaxed"
            data-testid="content-input"
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className={`text-xs ${content.length > 450 ? "text-amber-500" : "text-gray-300"}`}>
                {content.length}/500
              </span>
              {error && (
                <span className="text-xs text-red-400" data-testid="form-error">
                  {error}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setContent("");
                  setError("");
                }}
                className="px-4 py-2 text-xs text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/30 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="btn-gradient px-5 py-2 text-white text-xs font-medium rounded-full disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                data-testid="submit-button"
              >
                {submitting ? "发布中..." : "发布 ✨"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
