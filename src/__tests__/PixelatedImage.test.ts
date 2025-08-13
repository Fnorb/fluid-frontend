import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PixelatedImage from "../components/PixelatedImage.vue";
import { nextTick } from "vue";

describe("PixelatedImage", () => {
  it("renders a canvas element", () => {
    const wrapper = mount(PixelatedImage, {
      props: {
        image: "test.png",
        duration: 1000,
        direction: "in",
      },
    });
    expect(wrapper.find("canvas").exists()).toBe(true);
  });

  it("emits animation-end after the duration", async () => {
    vi.useFakeTimers();

    let rafCallback: FrameRequestCallback | null = null;

    globalThis.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      rafCallback = cb;
      return 1;
    };

    // Mock HTMLCanvasElement.getContext to prevent JSDOM error
    const mockContext = {
      drawImage: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      canvas: {
        width: 0,
        height: 0,
      },
    };

    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext as any);

    // Mock the Image constructor and onload event to trigger animation logic
    const img = {
      naturalWidth: 100,
      naturalHeight: 100,
      onload: vi.fn(),
      onerror: vi.fn(),
      src: "",
    };

    vi.spyOn(window, "Image").mockImplementation(() => {
      // Simulate async load
      setTimeout(() => img.onload(new Event("load")), 50);
      return img as any;
    });

    const wrapper = mount(PixelatedImage, {
      props: {
        image: "test.png",
        duration: 1000,
        direction: "in",
      },
    });

    // Wait for the component to mount and watch to trigger
    await nextTick();

    // Wait for the mocked image load to complete
    vi.advanceTimersByTime(50);
    await nextTick();

    // Simulate the animation frames
    const start = performance.now();
    const step = 100;

    for (let t = start; t <= start + 1000; t += step) {
      if (rafCallback) {
        (rafCallback as FrameRequestCallback)(t);
      }
      await nextTick();
    }

    // Call the callback one last time to ensure the animation-end event is emitted
    if (rafCallback) {
      (rafCallback as FrameRequestCallback)(start + 1000 + 1);
    }
    await nextTick();

    expect(wrapper.emitted("animation-end")).toBeTruthy();

    vi.useRealTimers();
  });
});
