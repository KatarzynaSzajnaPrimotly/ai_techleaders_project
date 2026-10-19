import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Backdrop from "./backdrop";

type FakeCtx = ReturnType<typeof createCtx>;

function createCtx() {
  return {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    fill: vi.fn(),
    getImageData: vi.fn((_x: number, _y: number, w: number, h: number) => {
      const data = new Uint8ClampedArray(w * h * 4);
      for (let i = 0; i < w * h; i++) data[i * 4 + 3] = i % 7 === 0 ? 0 : 255;
      return { data };
    }),
    fillStyle: "",
    globalAlpha: 1,
  };
}

interface Options {
  width?: number;
  height?: number;
  dpr?: number | undefined;
  mainRight?: number | null;
  duneCtx?: FakeCtx | null;
  markCtx?: FakeCtx | null;
  offCtx?: FakeCtx | null;
}

let observers: Array<{ callback: () => void; observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }>;

function mount(options: Options = {}) {
  const {
    width = 1200,
    height = 800,
    dpr = 1,
    mainRight = 700,
    duneCtx = createCtx(),
    markCtx = createCtx(),
    offCtx = createCtx(),
  } = options;

  vi.stubGlobal("devicePixelRatio", dpr);
  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({ width, height } as DOMRect);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (
    this: HTMLCanvasElement,
    _type: string,
    attributes?: unknown,
  ) {
    if (attributes) return offCtx as never;
    return (this.classList.contains("dune") ? duneCtx : markCtx) as never;
  } as never);

  const host = document.createElement("div");
  host.className = "starter";
  if (mainRight !== null) {
    const main = document.createElement("main");
    main.getBoundingClientRect = () => ({ right: mainRight }) as DOMRect;
    host.appendChild(main);
  }
  document.body.appendChild(host);

  const view = render(<Backdrop />, { container: host.appendChild(document.createElement("div")) });
  return { ...view, duneCtx, markCtx, offCtx, host };
}

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(callback: () => void) {
        observers.push({ callback, observe: this.observe, disconnect: this.disconnect });
      }
    },
  );
  vi.stubGlobal("Path2D", class {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("Backdrop", () => {
  it("renders two canvases and a vignette, hidden from assistive technology", () => {
    const { container } = mount();
    const root = container.querySelector(".backdrop");
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelectorAll("canvas")).toHaveLength(2);
    expect(container.querySelector(".vignette")).not.toBeNull();
  });

  it("sizes the canvases to the device pixel ratio and paints the dune grains", () => {
    const { container, duneCtx } = mount({ width: 1200, height: 800, dpr: 1.5 });
    const dune = container.querySelector<HTMLCanvasElement>(".dune")!;
    expect(dune.width).toBe(1800);
    expect(dune.height).toBe(1200);
    expect(container.querySelector<HTMLCanvasElement>(".mark-field")!.width).toBe(1800);
    expect(duneCtx!.setTransform).toHaveBeenCalledWith(1.5, 0, 0, 1.5, 0, 0);
    expect(duneCtx!.clearRect).toHaveBeenCalledWith(0, 0, 1200, 800);
    expect(duneCtx!.fillRect.mock.calls.length).toBeGreaterThan(1000);
    expect(duneCtx!.fillStyle).toBe("#f8fec6");
    expect(duneCtx!.globalAlpha).toBe(1);
  });

  it("draws the brand mark through an offscreen mask when there is room beside the copy", () => {
    const { markCtx, offCtx } = mount({ width: 1200, height: 800, mainRight: 700 });
    expect(offCtx!.translate).toHaveBeenCalledTimes(1);
    expect(offCtx!.scale).toHaveBeenCalledTimes(1);
    expect(offCtx!.fill).toHaveBeenCalledWith(expect.anything(), "nonzero");
    expect(offCtx!.getImageData).toHaveBeenCalledWith(0, 0, 1200, 800);
    expect(markCtx!.fillRect).toHaveBeenCalled();
  });

  it("skips the mark when the page has no copy element", () => {
    const { markCtx, offCtx } = mount({ mainRight: null });
    expect(offCtx!.getImageData).not.toHaveBeenCalled();
    expect(markCtx!.fillRect).not.toHaveBeenCalled();
  });

  it("skips the mark when the pane is too narrow beside the copy", () => {
    const { markCtx, offCtx } = mount({ width: 500, mainRight: 400 });
    expect(offCtx!.getImageData).not.toHaveBeenCalled();
    expect(markCtx!.fillRect).not.toHaveBeenCalled();
  });

  it("skips the mark when an offscreen 2d context is unavailable", () => {
    const { duneCtx, markCtx } = mount({ offCtx: null });
    expect(duneCtx!.fillRect).toHaveBeenCalled();
    expect(markCtx!.fillRect).not.toHaveBeenCalled();
  });

  it("does nothing when the dune canvas has no 2d context", () => {
    const { markCtx } = mount({ duneCtx: null });
    expect(markCtx!.setTransform).not.toHaveBeenCalled();
    expect(observers).toHaveLength(0);
  });

  it("does nothing when the mark canvas has no 2d context", () => {
    const { duneCtx } = mount({ markCtx: null });
    expect(duneCtx!.setTransform).not.toHaveBeenCalled();
    expect(observers).toHaveLength(0);
  });

  it("falls back to a pixel ratio of 1 and caps high ratios at 2", () => {
    const low = mount({ dpr: 0 });
    expect(low.duneCtx!.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    low.unmount();
    const high = mount({ dpr: 4 });
    expect(high.duneCtx!.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });

  it("copes with a zero-sized pane", () => {
    const { container, duneCtx } = mount({ width: 0, height: 0, mainRight: null });
    expect(container.querySelector<HTMLCanvasElement>(".dune")!.width).toBe(1);
    expect(duneCtx!.clearRect).toHaveBeenCalledWith(0, 0, 0, 0);
  });

  it("redraws when the canvas is resized and stops observing on unmount", () => {
    const { duneCtx, unmount } = mount();
    expect(observers).toHaveLength(1);
    expect(observers[0].observe).toHaveBeenCalledTimes(1);
    const before = duneCtx!.clearRect.mock.calls.length;
    observers[0].callback();
    expect(duneCtx!.clearRect.mock.calls.length).toBe(before + 1);
    unmount();
    expect(observers[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it("still paints when the very first grid row is visible", () => {
    // With the real constants the noise field never lifts the first (overscan) row into view, so that fallback
    // is a defensive branch. Amplifying the pusher falloff pushes the field far enough to reach it.
    vi.spyOn(Math, "exp").mockReturnValue(5);
    const { duneCtx } = mount({ mainRight: null });
    expect(duneCtx!.fillRect).toHaveBeenCalled();
  });

  it.each([
    [320, 480],
    [800, 600],
    [1600, 900],
    [2400, 1400],
  ])("renders a %ix%i pane without errors", (width, height) => {
    const { duneCtx } = mount({ width, height });
    expect(duneCtx!.fillRect).toHaveBeenCalled();
  });
});
