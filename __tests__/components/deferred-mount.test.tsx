import { render, screen, act } from "@testing-library/react";
import { DeferredMount } from "@/components/deferred-mount";

describe("DeferredMount", () => {
  it("shows placeholder until intersection", () => {
    const observe = jest.fn();
    const disconnect = jest.fn();
    const mockObserver = jest.fn((cb: IntersectionObserverCallback) => {
      return {
        observe,
        disconnect,
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: "",
        thresholds: [],
      } as unknown as IntersectionObserver;
    });

    const Original = global.IntersectionObserver;
    global.IntersectionObserver = mockObserver as unknown as typeof IntersectionObserver;

    render(
      <DeferredMount minHeight="100px" loadingLabel="Loading block">
        <div>Child content</div>
      </DeferredMount>
    );

    expect(screen.getByLabelText("Loading block")).toBeInTheDocument();
    expect(screen.queryByText("Child content")).not.toBeInTheDocument();

    const instance = mockObserver.mock.calls[0][0];
    act(() => {
      instance(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(screen.getByText("Child content")).toBeInTheDocument();

    global.IntersectionObserver = Original;
  });
});
