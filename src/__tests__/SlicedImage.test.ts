import { mount } from "@vue/test-utils";
import SlicedImage from "../components/SlicedImage.vue";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";

class MockImage {
  naturalWidth = 200;
  naturalHeight = 100;
  onload: null | (() => void) = null;
  private _src = "";
  set src(v: string) {
    this._src = v;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.onload && this.onload();
  }
  get src() {
    return this._src;
  }
}

describe("SlicedImage.vue", () => {
  let ctx: any;
  let OriginalImage: any;
  let originalGetContext: any;

  beforeEach(() => {
    ctx = { drawImage: vi.fn() };
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    (HTMLCanvasElement.prototype as any).getContext = vi.fn(() => ctx);

    OriginalImage = (globalThis as any).Image;
    (globalThis as any).Image = MockImage as any;
  });

  afterEach(() => {
    (globalThis as any).Image = OriginalImage;
    (HTMLCanvasElement.prototype as any).getContext = originalGetContext;
    vi.restoreAllMocks();
  });

  it("setzt Canvas-Größe und zeichnet die Slices inkl. Gaps", async () => {
    const slices = [3, 10, 87];
    const gap = 5;

    const wrapper = mount(SlicedImage, {
      props: { src: "test.png", slices, gap },
    });

    await nextTick();

    const canvas = wrapper.find("canvas").element as HTMLCanvasElement;

    expect(canvas.width).toBe(200 + (slices.length - 1) * gap); // 210
    expect(canvas.height).toBe(100);

    const totalCalls = (ctx.drawImage as any).mock.calls.length;
    expect(totalCalls).toBeGreaterThanOrEqual(slices.length);
    expect(totalCalls % slices.length).toBe(0);

    expect(ctx.drawImage).toHaveBeenNthCalledWith(
      1,
      expect.any(MockImage),
      0,
      0,
      6,
      100,
      0,
      0,
      6,
      100
    );

    expect(ctx.drawImage).toHaveBeenNthCalledWith(
      2,
      expect.any(MockImage),
      6,
      0,
      20,
      100,
      11,
      0,
      20,
      100
    );

    expect(ctx.drawImage).toHaveBeenNthCalledWith(
      3,
      expect.any(MockImage),
      26,
      0,
      174,
      100,
      36,
      0,
      174,
      100
    );
  });

  it("redrawt bei Prop-Änderung (gap) und passt Breite an", async () => {
    const slices = [3, 10, 87];

    const wrapper = mount(SlicedImage, {
      props: { src: "test.png", slices, gap: 5 },
    });
    await nextTick();

    const canvas = wrapper.find("canvas").element as HTMLCanvasElement;
    const callsBefore = (ctx.drawImage as any).mock.calls.length;

    expect(canvas.width).toBe(200 + (slices.length - 1) * 5);

    await wrapper.setProps({ gap: 10 });
    await nextTick();

    expect(canvas.width).toBe(200 + (slices.length - 1) * 10);

    const callsAfter = (ctx.drawImage as any).mock.calls.length;
    expect(callsAfter - callsBefore).toBeGreaterThanOrEqual(slices.length);
  });
});
