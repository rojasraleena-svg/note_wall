import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroHeader from "@/components/HeroHeader";

describe("HeroHeader", () => {
  it("should render the brand logo", () => {
    render(<HeroHeader />);
    expect(screen.getByTestId("brand-logo")).toBeInTheDocument();
  });

  it("should display the main title '留言墙'", () => {
    render(<HeroHeader />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("留言墙");
  });

  it("should display a subtitle/description", () => {
    render(<HeroHeader />);
    const subtitle = screen.getByTestId("hero-subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.textContent).toBeTruthy();
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
});
