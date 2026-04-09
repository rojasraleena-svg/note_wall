import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MessageForm from "@/components/MessageForm";

describe("MessageForm", () => {
  it("should render collapsed form with placeholder text", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    expect(screen.getByTestId("message-form")).toBeInTheDocument();
    expect(screen.getByText("写下你的留言...")).toBeInTheDocument();
  });

  it("should expand form when clicked", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写下你的留言..."));

    expect(screen.getByTestId("nickname-input")).toBeInTheDocument();
    expect(screen.getByTestId("content-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("should show character count when typing", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写下你的留言..."));

    const textarea = screen.getByTestId("content-input");
    fireEvent.change(textarea, { target: { value: "你好" } });

    expect(screen.getByText("2/500")).toBeInTheDocument();
  });

  it("should disable submit button when content is empty", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写下你的留言..."));

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("should call onSubmit with nickname and content", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写下你的留言..."));

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

    fireEvent.click(screen.getByText("写下你的留言..."));

    const contentInput = screen.getByTestId("content-input");
    fireEvent.change(contentInput, { target: { value: "测试" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("form-error")).toHaveTextContent(
        "发布失败，请稍后重试"
      );
    });
  });

  it("should collapse and clear when cancel is clicked", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<MessageForm onSubmit={onSubmit} submitting={false} />);

    fireEvent.click(screen.getByText("写下你的留言..."));

    const contentInput = screen.getByTestId("content-input");
    fireEvent.change(contentInput, { target: { value: "测试内容" } });

    fireEvent.click(screen.getByText("取消"));

    expect(screen.getByText("写下你的留言...")).toBeInTheDocument();
  });
});
