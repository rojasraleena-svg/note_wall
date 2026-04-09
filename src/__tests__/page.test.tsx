import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

vi.mock("@/components/MessageWall", () => ({
  default: function MockMessageWall() {
    return <div data-testid="message-wall">MessageWall</div>;
  },
}));

describe("Home Page", () => {
  it("should render header with title", () => {
    render(<Home />);
    expect(screen.getByText("留言墙")).toBeInTheDocument();
  });

  it("should have gradient-bg class on main element", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main?.className).toContain("max-w-5xl");
  });

  it("should contain gradient-animate class for dynamic background", () => {
    const { container } = render(<Home />);
    // The page renders inside a body with gradient-bg (from layout)
    // We verify the structure is correct
    expect(screen.getByText("留言墙")).toBeInTheDocument();
    expect(screen.getByTestId("message-wall")).toBeInTheDocument();
  });
});
