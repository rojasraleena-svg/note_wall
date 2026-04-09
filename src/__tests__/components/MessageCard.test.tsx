import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/types/message";

const mockMessage: Message = {
  id: "test-1",
  nickname: "测试用户",
  content: "这是一条测试留言",
  avatar_seed: "testseed",
  likes: 3,
  created_at: "2026-04-09T10:00:00Z",
  is_pinned: false,
};

describe("MessageCard", () => {
  it("should render message content", () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    expect(screen.getByText("测试用户")).toBeInTheDocument();
    expect(screen.getByText("这是一条测试留言")).toBeInTheDocument();
    expect(screen.getByTestId("like-count")).toHaveTextContent("3");
  });

  it("should call onLike when like button is clicked", () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    const likeButton = screen.getByTestId("like-button");
    fireEvent.click(likeButton);

    expect(onLike).toHaveBeenCalledWith("test-1");
  });

  it("should not call onLike when already liked", () => {
    const onLike = vi.fn();
    localStorage.setItem("liked_test-1", "true");

    render(<MessageCard message={mockMessage} onLike={onLike} />);

    const likeButton = screen.getByTestId("like-button");
    fireEvent.click(likeButton);

    expect(onLike).not.toHaveBeenCalled();

    localStorage.removeItem("liked_test-1");
  });

  it("should show pinned badge when message is pinned", () => {
    const pinnedMessage = { ...mockMessage, is_pinned: true };
    const onLike = vi.fn();
    render(<MessageCard message={pinnedMessage} onLike={onLike} />);

    expect(screen.getByText("置顶")).toBeInTheDocument();
  });

  it("should not show pinned badge when message is not pinned", () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    expect(screen.queryByText("置顶")).not.toBeInTheDocument();
  });
});
