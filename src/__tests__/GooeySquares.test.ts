import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import GooeySquares from "../components/GooeySquares.vue";

vi.mock("gsap", () => ({
  gsap: {
    to: vi.fn(),
    set: vi.fn(),
  },
}));

describe("Gooey Squares", () => {
  it("renders multiple squares", async () => {
    const wrapper = mount(GooeySquares);
    await wrapper.vm.$nextTick();
    const squares = wrapper.findAll(".square");
    expect(squares.length).toBeGreaterThanOrEqual(1);
  });
});
