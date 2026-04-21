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

  const charRatio = content.length / 500;

  return (
    <form
      onSubmit={handleSubmit}
      className="note-form"
      data-testid="message-form"
    >
      <div className={`note-form-shell ${expanded ? "note-form-shell--active" : ""}`}>
        {/* Collapsed state — click-to-expand trigger */}
        {!expanded ? (
          <button
            type="button"
            className="form-trigger"
            onClick={() => setExpanded(true)}
            data-testid="form-trigger"
          >
            <span className="form-trigger-avatar">
              {nickname.trim() ? nickname.trim()[0].toUpperCase() : "留"}
            </span>
            <div className="form-trigger-body">
              <span className="form-trigger-label">写一句</span>
              <span className="form-trigger-hint">匿名也可以。</span>
            </div>
            <span className="form-trigger-arrow" aria-hidden="true">→</span>
          </button>
        ) : (
          /* Expanded state */
          <div className="form-expanded animate-fade-in-up">
            {/* Nickname row */}
            <div className="form-nickname-row">
              <span className="form-nickname-avatar">
                {nickname.trim() ? nickname.trim()[0].toUpperCase() : "留"}
              </span>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="署名（可选）"
                maxLength={50}
                className="note-input form-nickname-input"
                data-testid="nickname-input"
                autoFocus
              />
            </div>

            {/* Textarea */}
            <div className="form-textarea-wrap">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="把一句话贴上来..."
                maxLength={500}
                rows={4}
                className={`note-textarea form-textarea ${
                  textareaFocused ? "focus-shine" : ""
                }`}
                data-testid="content-input"
                onFocus={() => setTextareaFocused(true)}
                onBlur={() => setTextareaFocused(false)}
              />
              {/* Character progress bar */}
              <div className="form-char-track">
                <div
                  className="form-char-fill"
                  style={{
                    width: `${Math.min(charRatio * 100, 100)}%`,
                    backgroundColor:
                      charRatio > 0.9
                        ? "var(--color-accent)"
                        : charRatio > 0.7
                        ? "var(--color-highlight)"
                        : "var(--color-ink)",
                  }}
                />
              </div>
            </div>

            {/* Actions row */}
            <div className="form-actions">
              <div className="form-actions-left">
                <span
                  className={`form-char-count ${
                    content.length > 450 ? "form-char-count--warn" : ""
                  }`}
                >
                  {content.length}/500
                </span>
                {error && (
                  <span
                    className="form-error"
                    data-testid="form-error"
                  >
                    {error}
                  </span>
                )}
              </div>
              <div className="form-actions-right">
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(false);
                    setContent("");
                    setError("");
                  }}
                  className="form-btn-cancel"
                >
                  收起
                </button>
                <button
                  type="submit"
                  ref={submitRef}
                  disabled={submitting || !content.trim()}
                  className="form-btn-submit"
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
