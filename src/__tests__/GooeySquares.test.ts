import { mount } from "@vue/test-utils";
import GooeySquares from "../components/GooeySquares.vue";
import { describe, it, expect } from "vitest";
import { nextTick } from "vue";

describe("GooeySquares.vue", () => {
  it("renders 20 normal and 20 gooey squares", async () => {
    const wrapper = mount(GooeySquares);

    await nextTick();

    const normalSquares = wrapper.findAll(".square.normal");
    const gooeySquares = wrapper.findAll(".square.gooey");

    expect(normalSquares).toHaveLength(20);
    expect(gooeySquares).toHaveLength(20);
  });
});
