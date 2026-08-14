import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DemoProvider } from "@/lib/demo-store";
import { AppShell } from "./app-shell";

const navigation = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard", useRouter: () => ({ replace: navigation.replace }) }));
vi.mock("@/lib/auth", () => ({ useAuth: () => ({ ready: true, user: { id: "test-user" } }) }));
const theme = vi.hoisted(() => ({ setTheme: vi.fn() }));
vi.mock("next-themes", () => ({ useTheme: () => ({ theme: "light", setTheme: theme.setTheme }) }));

describe("AppShell", () => {
  it("exposes accessible primary navigation and content", () => {
    render(<DemoProvider><AppShell><h1>Test content</h1></AppShell></DemoProvider>);
    expect(screen.getByRole("navigation", { name: /nawigacja/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dzisiaj/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("heading", { name: "Test content" })).toBeInTheDocument();
  });

  it("switches from light to dark theme", () => {
    render(<DemoProvider><AppShell><span>Content</span></AppShell></DemoProvider>);
    fireEvent.click(screen.getByRole("button", { name: /motyw/i }));
    expect(theme.setTheme).toHaveBeenCalledWith("dark");
  });
});