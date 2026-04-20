import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import HeroHeader from "@/components/HeroHeader";

describe("HeroHeader", () => {
  it("should render the brand logo", () => {
    render(<HeroHeader />);
    expect(screen.getByTestId("brand-logo")).toBeInTheDocument();
  });

  it("should display the main title '留言墙'", () => {
    render(<HeroHeader />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "留言墙"
    );
  });

  it("should display a subtitle/description", () => {
    render(<HeroHeader />);
    const subtitle = screen.getByTestId("hero-subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent("匿名或署名，都能被看见。");
  });

  it("should show online status indicator", () => {
    render(<HeroHeader />);
    const statusBadge = screen.getByTestId("online-status");
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent(/online/i);
  });

  it("should have decorative background elements", () => {
    const { container } = render(<HeroHeader />);
    const decoratives = container.querySelectorAll("[data-testid^='hero-decor']");
    expect(decoratives.length).toBeGreaterThanOrEqual(1);
  });

  it("should render the hero frame container", () => {
    const { container } = render(<HeroHeader />);
    const heroCard = container.querySelector(".hero-frame");
    expect(heroCard).toBeInTheDocument();
  });

  it("should render enter button for notes wall", () => {
    render(<HeroHeader />);
    expect(screen.getByTestId("enter-notes-button")).toHaveTextContent(
      "进入留言墙"
    );
  });

  it("should render archive showcase copy", () => {
    render(<HeroHeader />);
    expect(screen.getByText("今天路过，也能留下句子。")).toBeInTheDocument();
    expect(screen.getByText("让一句话，", { exact: false })).toBeInTheDocument();
  });

  it("should scroll to notes wall when enter button is clicked", () => {
    const scrollIntoView = vi.fn();
    const originalGetElementById = document.getElementById.bind(document);
    vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
      if (id === "notes-wall") {
        return { scrollIntoView } as unknown as HTMLElement;
      }
      return originalGetElementById(id);
    });

    render(<HeroHeader />);
    fireEvent.click(screen.getByTestId("enter-notes-button"));

    expect(scrollIntoView).toHaveBeenCalled();
  });
});
