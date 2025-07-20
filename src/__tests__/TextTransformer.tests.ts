import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TextTransformer from "../components/TextTransformer.vue";

describe("TextTransformer", () => {
  it("renders each character in a span", () => {
    const testString = "Hello!";
    const wrapper = mount(TextTransformer, {
      props: { text: testString },
    });

    const spans = wrapper.findAll(".visible span");

    expect(spans.length).toBe(testString.length);

    spans.forEach((spanWrapper, i) => {
      expect(spanWrapper.text()).toBe(testString[i]);
    });
  });
});
