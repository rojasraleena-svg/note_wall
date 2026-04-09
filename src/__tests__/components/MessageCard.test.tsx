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

  it("should apply 3D tilt transform on mousemove", () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    const card = screen.getByTestId("message-card");

    // Simulate mouse entering and moving across the card
    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 200, clientY: 150 });

    // Card should have a transform style with rotate (non-identity)
    const style = card.getAttribute("style") || "";
    expect(style).toContain("rotateX");
    expect(style).toContain("rotateY");
  });

  it("should reset tilt transform on mouseleave", () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    const card = screen.getByTestId("message-card");

    // Move mouse to trigger tilt
    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 200, clientY: 150 });
    expect(card.getAttribute("style") || "").toContain("rotate");

    // Leave should reset
    fireEvent.mouseLeave(card);
    const styleAfterLeave = card.getAttribute("style") || "";
    expect(styleAfterLeave).not.toContain("rotateX");
    expect(styleAfterLeave).not.toContain("rotateY");
  });

  it("should have perspective style for 3D effect", () => {
    const onLike = vi.fn();
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    const card = screen.getByTestId("message-card");
    expect(card.style.perspective).toBeDefined();
  });

  it("should apply heartbeat animation class when liked", async () => {
    const onLike = vi.fn().mockResolvedValue(4);
    render(<MessageCard message={mockMessage} onLike={onLike} />);

    const likeButton = screen.getByTestId("like-button");
    fireEvent.click(likeButton);

    // After clicking, the heart icon should have heartbeat animation
    await waitFor(() => {
      const heartSpan = likeButton.querySelector("span:first-child");
      expect(heartSpan?.className).toContain("animate-like-heartbeat");
    });
  });

  // --- Visual enhancement tests ---

  it("should apply pinned card styling for pinned messages", () => {
    const pinnedMessage = { ...mockMessage, is_pinned: true };
    const onLike = vi.fn();
    const { container } = render(<MessageCard message={pinnedMessage} onLike={onLike} />);

    const card = container.querySelector("[data-testid='message-card']");
    const cls = card?.getAttribute("class") ?? "";
    expect(cls).toContain("card-pinned");
  });

  it("should NOT apply pinned styling for non-pinned messages", () => {
    const onLike = vi.fn();
    const { container } = render(<MessageCard message={mockMessage} onLike={onLike} />);

    const card = container.querySelector("[data-testid='message-card']");
    const cls = card?.getAttribute("class") ?? "";
    expect(cls).not.toContain("card-pinned");
  });

  it("should apply popular card styling for messages with many likes", () => {
    const popularMessage = { ...mockMessage, likes: 15 };
    const onLike = vi.fn();
    const { container } = render(<MessageCard message={popularMessage} onLike={onLike} />);

    const card = container.querySelector("[data-testid='message-card']");
    const cls = card?.getAttribute("class") ?? "";
    expect(cls).toContain("card-popular");
  });

  it("should NOT apply popular styling for messages with few likes", () => {
    const onLike = vi.fn();
    const { container } = render(<MessageCard message={mockMessage} onLike={onLike} />);

    const card = container.querySelector("[data-testid='message-card']");
    const cls = card?.getAttribute("class") ?? "";
    expect(cls).not.toContain("card-popular");
  });
});
