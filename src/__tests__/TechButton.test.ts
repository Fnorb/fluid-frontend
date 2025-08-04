import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TechButton from "../components//TechButton.vue";

describe("TechButton", () => {
  it("renders the tech name", () => {
    const wrapper = mount(TechButton, {
      props: {
        techName: "Vue",
        isActive: false,
      },
    });

    expect(wrapper.text()).toContain("Vue");
  });

  it("emits click event when internal button is clicked", async () => {
    const wrapper = mount(TechButton, {
      props: {
        techName: "Vue.js",
        isActive: false,
      },
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("applies the brightness-150 class when isActive is true", () => {
    const wrapper = mount(TechButton, {
      props: {
        techName: "Vue.js",
        isActive: true,
      },
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("brightness-150");
  });
});
