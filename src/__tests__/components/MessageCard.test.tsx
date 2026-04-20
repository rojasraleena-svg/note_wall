import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

    fireEvent.click(screen.getByTestId("like-button"));

    expect(onLike).toHaveBeenCalledWith("test-1");
  });

  it("should not call onLike when already liked", () => {
    const onLike = vi.fn();
    localStorage.setItem("liked_test-1", "true");

    render(<MessageCard message={mockMessage} onLike={onLike} />);

    fireEvent.click(screen.getByTestId("like-button"));

    expect(onLike).not.toHaveBeenCalled();
    localStorage.removeItem("liked_test-1");
  });

  it("should clear stale like state when stored like exists but count is zero", async () => {
    const onLike = vi.fn();
    localStorage.setItem("liked_test-1", "true");

    render(
      <MessageCard message={{ ...mockMessage, likes: 0 }} onLike={onLike} />
    );

    await waitFor(() => {
      expect(localStorage.getItem("liked_test-1")).toBeNull();
      expect(screen.getByLabelText("点赞")).toBeEnabled();
    });
  });

  it("should show pinned badge when message is pinned", () => {
    const onLike = vi.fn();
    render(
      <MessageCard
        message={{ ...mockMessage, is_pinned: true }}
        onLike={onLike}
      />
    );

    expect(screen.getByText("置顶")).toBeInTheDocument();
  });

  it("should not show pinned badge when message is not pinned", () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    expect(screen.queryByText("置顶")).not.toBeInTheDocument();
  });

  it("should render note card element", () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    expect(screen.getByTestId("message-card")).toBeInTheDocument();
  });

  it("should apply heartbeat animation class when liked", async () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    const likeButton = screen.getByTestId("like-button");
    fireEvent.click(likeButton);

    await waitFor(() => {
      const heartSpan = likeButton.querySelector("span:first-child");
      expect(heartSpan?.className).toContain("animate-like-heartbeat");
    });
  });

  it("should apply pinned card styling for pinned messages", () => {
    const onLike = vi.fn();
    const { container } = render(
      <MessageCard
        message={{ ...mockMessage, is_pinned: true }}
        onLike={onLike}
      />
    );

    const card = container.querySelector("[data-testid='message-card']");
    expect(card?.getAttribute("class") ?? "").toContain("card-pinned");
  });

  it("should apply popular card styling for messages with many likes", () => {
    const onLike = vi.fn();
    const { container } = render(
      <MessageCard message={{ ...mockMessage, likes: 15 }} onLike={onLike} />
    );

    const card = container.querySelector("[data-testid='message-card']");
    expect(card?.getAttribute("class") ?? "").toContain("card-popular");
    expect(screen.getByText("较热")).toBeInTheDocument();
  });

  it("should not apply popular styling for messages with few likes", () => {
    const onLike = vi.fn();
    const { container } = render(
      <MessageCard message={mockMessage} onLike={onLike} />
    );

    const card = container.querySelector("[data-testid='message-card']");
    expect(card?.getAttribute("class") ?? "").not.toContain("card-popular");
  });
});
