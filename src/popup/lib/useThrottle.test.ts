import { act, renderHook } from "@testing-library/react";
import { useThrottle } from "./useThrottle";

describe("useThrottle", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test("returns initial value immediately", () => {
    const { result } = renderHook(() => useThrottle("initial", 200));

    expect(result.current).toBe("initial");
  });

  test("throttles subsequent updates", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 200),
      { initialProps: { value: "first" } },
    );

    expect(result.current).toBe("first");

    rerender({ value: "second" });
    expect(result.current).toBe("first");

    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe("second");
  });

  test("uses latest value when multiple updates occur within throttle window", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 200),
      { initialProps: { value: "first" } },
    );

    expect(result.current).toBe("first");

    rerender({ value: "second" });
    rerender({ value: "third" });

    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe("third");
  });

  test("allows new value after throttle window expires", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 200),
      { initialProps: { value: "first" } },
    );

    act(() => jest.advanceTimersByTime(200));

    rerender({ value: "second" });
    expect(result.current).toBe("second");
  });
});
