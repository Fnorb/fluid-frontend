import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import TextTransformer from "../components/TextTransformer.vue";

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);

vi.mock("gsap", () => {
  const gsap = {
    set: vi.fn(),
    to: vi.fn(),
    registerPlugin: vi.fn(),
  };
  return {
    default: gsap,
    MotionPathPlugin: {},
  };
});

describe("TextTransformer.vue", () => {
  it("renders correct number of visible spans for initial text", async () => {
    const wrapper = mount(TextTransformer, {
      props: {
        text: "Test",
      },
      attachTo: document.body,
    });

    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const visibleContainer = wrapper.find('[data-testid="visible-container"]');
    expect(visibleContainer.exists()).toBe(true);

    const visibleSpans = visibleContainer.findAll("span");
    expect(visibleSpans.length).toBe(4);
  });
});
