import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DemoProvider, useDemo } from "./demo-store";

describe("DemoProvider", () => {
  afterEach(() => { vi.useRealTimers(); window.localStorage?.clear(); });

  it("updates review progress and XP", () => {
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    const xp = result.current.xp;
    act(() => result.current.rateReview());
    expect(result.current.reviewIndex).toBe(1);
    expect(result.current.xp).toBe(xp + 8);
  });

  it("removes a mentor memory", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    const id = result.current.memories[0].id;
    act(() => result.current.deleteMemory(id));
    expect(result.current.memories.some(memory => memory.id === id)).toBe(false);
  });

  it("toggles consent independently", () => {
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    const before = result.current.consents.analytics;
    act(() => result.current.toggleConsent("analytics"));
    expect(result.current.consents.analytics).toBe(!before);
  });

  it("completes onboarding and can reset local progress", () => {
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    act(() => result.current.completeOnboarding("Anna", "B2"));
    expect(result.current.name).toBe("Anna");
    expect(result.current.level).toBe("B2");
    act(() => result.current.changeLevel("C2"));
    expect(result.current.level).toBe("C2");
    act(() => result.current.reset());
    expect(result.current.name).toBe("Rafa\u0142");
    expect(result.current.reviewIndex).toBe(0);
  });

  it("stores a learner turn and asynchronously adds contextual mentor feedback", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    let pending!: Promise<void>;
    act(() => { pending = result.current.sendMessage("I'd like to review the agenda"); });
    expect(result.current.messages.at(-1)?.actor).toBe("user");
    expect(result.current.isReplying).toBe(true);
    await act(async () => { await vi.advanceTimersByTimeAsync(850); await pending; });
    expect(result.current.messages.at(-1)?.actor).toBe("mentor");
    expect(result.current.messages.at(-1)?.text).toContain("natural");
    expect(result.current.xp).toBe(1255);
  });

  it("ignores empty messages and clears notifications", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    await act(async () => result.current.sendMessage("   "));
    expect(result.current.messages).toHaveLength(1);
    act(() => result.current.notify("Saved"));
    expect(result.current.toast).toBe("Saved");
    await act(async () => vi.advanceTimersByTimeAsync(2800));
    expect(result.current.toast).toBe("");
  });

  it("requires the provider boundary", () => {
    expect(() => renderHook(() => useDemo())).toThrow("useDemo outside provider");
  });
});