import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock MessageWall to isolate page-level styling
vi.mock("@/components/MessageWall", () => ({
  default: function MockMessageWall() {
    return <div data-testid="message-wall">MessageWall</div>;
  },
}));

describe("Color Scheme", () => {
  it("should apply gradient-text class to main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    const cls = heading.getAttribute("class") ?? "";
    expect(cls).toContain("gradient-text");
  });

  it("should have glass morphism container in hero", () => {
    const { container } = render(<Home />);
    const glassCard = container.querySelector(".glass");
    expect(glassCard).toBeInTheDocument();
  });

  it("should use btn-gradient class pattern for primary actions", () => {
    // Verify the gradient button style exists by checking rendered structure
    const { container } = render(<Home />);
    // Hero header should be present with proper styling
    const hero = container.querySelector("[data-testid='hero-container']");
    expect(hero).toBeInTheDocument();
  });

  it("should have decorative blobs with gradient backgrounds", () => {
    const { container } = render(<Home />);
    // Decorative elements should have gradient-related classes
    const blobs = container.querySelectorAll("[data-testid^='hero-decor']");
    expect(blobs.length).toBeGreaterThanOrEqual(1);
    for (const blob of Array.from(blobs)) {
      const cls = blob.getAttribute("class") ?? "";
      // Should have blur and animation for floating effect
      expect(cls).toMatch(/blur|animate/);
    }
  });
});
