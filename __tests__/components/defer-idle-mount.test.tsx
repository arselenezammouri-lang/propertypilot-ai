import { render, screen, act } from "@testing-library/react";
import { DeferIdleMount } from "@/components/defer-idle-mount";

describe("DeferIdleMount", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders children after timeout when requestIdleCallback missing", async () => {
    const ric = global.requestIdleCallback;
    const cic = global.cancelIdleCallback;
    // @ts-expect-error test env
    delete global.requestIdleCallback;
    // @ts-expect-error test env
    delete global.cancelIdleCallback;

    render(
      <DeferIdleMount delayMs={100}>
        <span>Idle child</span>
      </DeferIdleMount>
    );

    expect(screen.queryByText("Idle child")).not.toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText("Idle child")).toBeInTheDocument();

    global.requestIdleCallback = ric;
    global.cancelIdleCallback = cic;
  });
});
