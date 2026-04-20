import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("should render footer element", () => {
    render(<Footer />);
    const footer = screen.getByTestId("site-footer");
    expect(footer).toBeInTheDocument();
    expect(footer.tagName.toLowerCase()).toBe("footer");
  });

  it("should display brand name with logo", () => {
    render(<Footer />);
    expect(screen.getAllByTestId("brand-logo")).toHaveLength(1);
    expect(screen.getByText(/留言墙/)).toBeInTheDocument();
  });

  it("should show GitHub link", () => {
    render(<Footer />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/rojasraleena-svg/note_wall"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should display tech stack info", () => {
    render(<Footer />);
    expect(screen.getByText(/Next\.js/i)).toBeInTheDocument();
    expect(screen.getByText(/Supabase/i)).toBeInTheDocument();
  });

  it("should have decorative separator or visual element", () => {
    const { container } = render(<Footer />);
    const decor = container.querySelector("[data-testid='footer-decor']");
    expect(decor).toBeInTheDocument();
  });
});
