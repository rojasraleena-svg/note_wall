import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BrandLogo from "@/components/BrandLogo";

describe("BrandLogo", () => {
  it("should render an SVG element", () => {
    render(<BrandLogo />);
    const svg = screen.getByTestId("brand-logo");
    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("should have accessible role and label", () => {
    render(<BrandLogo />);
    const svg = screen.getByTestId("brand-logo");
    expect(svg).toHaveAttribute("role", "img");
    expect(svg.getAttribute("aria-label")).toContain("留言墙");
  });

  it("should accept size prop with default 48px", () => {
    const { container } = render(<BrandLogo />);
    const svg = container.querySelector("svg");
    // Default size should be 48x48
    expect(svg?.getAttribute("width")).toBe("48");
    expect(svg?.getAttribute("height")).toBe("48");
  });

  it("should render custom size when provided", () => {
    const { container } = render(<BrandLogo size={64} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("64");
    expect(svg?.getAttribute("height")).toBe("64");
  });

  it("should contain visual paths (note/wall motif)", () => {
    render(<BrandLogo />);
    const svg = screen.getByTestId("brand-logo");
    // Should have path or shape elements inside
    const paths = svg.querySelectorAll("path, circle, rect");
    expect(paths.length).toBeGreaterThan(0);
  });

  it("should apply className prop for styling", () => {
    const { container } = render(<BrandLogo className="custom-class" />);
    const svg = container.querySelector("svg");
    const cls = svg?.getAttribute("class") ?? "";
    expect(cls).toContain("custom-class");
  });
});
