import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

vi.mock("@/services/messageService", () => ({
  fetchMessageCount: vi.fn().mockResolvedValue(12),
}));

describe("Color Scheme", () => {
  it("should apply hero title styling to main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    const cls = heading.getAttribute("class") ?? "";
    expect(cls).toContain("hero-title");
  });

  it("should have framed hero container", () => {
    const { container } = render(<Home />);
    const glassCard = container.querySelector(".hero-frame");
    expect(glassCard).toBeInTheDocument();
  });

  it("should use the hero container as the main visual anchor", () => {
    const { container } = render(<Home />);
    const hero = container.querySelector("[data-testid='hero-container']");
    expect(hero).toBeInTheDocument();
  });

  it("should have decorative blobs with blurred backgrounds", () => {
    const { container } = render(<Home />);
    const blobs = container.querySelectorAll("[data-testid^='hero-decor']");
    expect(blobs.length).toBeGreaterThanOrEqual(1);
    for (const blob of Array.from(blobs)) {
      const cls = blob.getAttribute("class") ?? "";
      expect(cls).toMatch(/blur/);
    }
  });
});
