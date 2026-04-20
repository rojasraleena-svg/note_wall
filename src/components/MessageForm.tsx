"use client";

import { FormEvent, useState } from "react";
import { useRipple } from "@/hooks/useRipple";

interface MessageFormProps {
  onSubmit: (nickname: string, content: string) => Promise<void>;
  submitting: boolean;
}

export default function MessageForm({
  onSubmit,
  submitting,
}: MessageFormProps) {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [textareaFocused, setTextareaFocused] = useState(false);
  const { ref: submitRef, onClick: onRipple } = useRipple();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("留言内容不能为空");
      return;
    }
    if (trimmedContent.length > 500) {
      setError("留言内容不能超过 500 字");
      return;
    }

    try {
      await onSubmit(nickname.trim(), trimmedContent);
      setContent("");
      setExpanded(false);
      setError("");
    } catch {
      setError("发布失败，请稍后再试");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="note-form"
      data-testid="message-form"
    >
      <div className="note-form-shell rounded-[1.2rem] p-4 transition-all duration-300">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => !expanded && setExpanded(true)}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(19,17,15,0.08)] bg-[rgba(19,17,15,0.04)] text-sm font-semibold text-[var(--color-ink)]">
            {nickname.trim() ? nickname.trim()[0].toUpperCase() : "留"}
          </div>
          {!expanded ? (
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-ink)]">
                写一句
              </p>
              <p className="mt-1 text-sm text-[var(--color-soft)]">
                匿名也可以。
              </p>
            </div>
          ) : (
            <div className="flex-1 border-b border-[var(--color-line)] pb-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="署名（可选）"
                maxLength={50}
                className="note-input text-sm"
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
              placeholder="写一句短句..."
              maxLength={500}
              rows={4}
              className={`note-textarea rounded-[1rem] border border-[rgba(19,17,15,0.08)] px-4 py-4 text-sm leading-7 ${
                textareaFocused ? "focus-shine" : ""
              }`}
              data-testid="content-input"
              onFocus={() => setTextareaFocused(true)}
              onBlur={() => setTextareaFocused(false)}
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs ${
                    content.length > 450
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-soft)]"
                  }`}
                >
                  {content.length}/500
                </span>
                {error && (
                  <span
                    className="text-xs text-[var(--color-accent)]"
                    data-testid="form-error"
                  >
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
                  className="secondary-button rounded-full px-4 py-2 text-xs transition-colors"
                >
                  收起
                </button>
                <button
                  type="submit"
                  ref={submitRef}
                  disabled={submitting || !content.trim()}
                  className="editorial-button rounded-full px-5 py-2 text-xs font-semibold"
                  data-testid="submit-button"
                  onClick={onRipple}
                >
                  {submitting ? "发布中..." : "发布"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
