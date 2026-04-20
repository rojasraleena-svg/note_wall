import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MessageForm from "@/components/MessageForm";

describe("MessageForm", () => {
  it("should render collapsed form with placeholder text", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    expect(screen.getByTestId("message-form")).toBeInTheDocument();
    expect(screen.getByText("写一句")).toBeInTheDocument();
  });

  it("should expand form when clicked", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    expect(screen.getByTestId("nickname-input")).toBeInTheDocument();
    expect(screen.getByTestId("content-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("should show character count when typing", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    const textarea = screen.getByTestId("content-input");
    fireEvent.change(textarea, { target: { value: "你好" } });

    expect(screen.getByText("2/500")).toBeInTheDocument();
  });

  it("should disable submit button when content is empty", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("should call onSubmit with nickname and content", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    const nicknameInput = screen.getByTestId("nickname-input");
    const contentInput = screen.getByTestId("content-input");

    fireEvent.change(nicknameInput, { target: { value: "小明" } });
    fireEvent.change(contentInput, { target: { value: "测试留言" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("小明", "测试留言");
    });
  });

  it("should show error when onSubmit fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("fail"));
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    const contentInput = screen.getByTestId("content-input");
    fireEvent.change(contentInput, { target: { value: "测试" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("form-error")).toHaveTextContent(
        "发布失败，请稍后再试"
      );
    });
  });

  it("should collapse and clear when cancel is clicked", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    const contentInput = screen.getByTestId("content-input");
    fireEvent.change(contentInput, { target: { value: "测试内容" } });

    fireEvent.click(screen.getByText("收起"));

    expect(screen.getByText("写一句")).toBeInTheDocument();
  });

  it("should create ripple effect on submit button click", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    const contentInput = screen.getByTestId("content-input");
    fireEvent.change(contentInput, { target: { value: "测试留言" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const ripple = submitButton.querySelector(".ripple-effect");
      expect(ripple).toBeInTheDocument();
    });
  });

  it("should apply focus-shine class when textarea is focused", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    const textarea = screen.getByTestId("content-input");
    fireEvent.focus(textarea);

    expect(textarea.className).toContain("focus-shine");
  });

  it("should remove focus-shine class when textarea is blurred", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写一句"));

    const textarea = screen.getByTestId("content-input");
    fireEvent.focus(textarea);
    expect(textarea.className).toContain("focus-shine");

    fireEvent.blur(textarea);
    expect(textarea.className).not.toContain("focus-shine");
  });
});
