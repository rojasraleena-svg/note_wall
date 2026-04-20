import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

vi.mock("@/components/MessageWall", () => ({
  default: function MockMessageWall() {
    return <div data-testid="message-wall">MessageWall</div>;
  },
}));

describe("Home Page", () => {
  it("should render main heading '留言墙' in hero section", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("留言墙");
  });

  it("should render brand logo in hero section", () => {
    render(<Home />);
    expect(screen.getAllByTestId("brand-logo").length).toBeGreaterThanOrEqual(1);
  });

  it("should have proper main container layout", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main?.className).toContain("page-shell");
  });

  it("should contain MessageWall component", () => {
    render(<Home />);
    expect(screen.getByTestId("message-wall")).toBeInTheDocument();
  });

  it("should display online status indicator", () => {
    render(<Home />);
    expect(screen.getByTestId("online-status")).toBeInTheDocument();
  });
});
