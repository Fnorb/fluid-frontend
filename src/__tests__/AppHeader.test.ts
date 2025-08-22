import { mount } from "@vue/test-utils";
import Header from "../components/AppHeader.vue";
import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { TransitionStub } from "../utils/transitionStub";

describe("Header.vue", () => {
  it("rendert Titel und Desktop-Links (nav)", () => {
    const wrapper = mount(Header, {
      global: { stubs: { transition: TransitionStub } },
    });
    expect(wrapper.text()).toContain("Fluid Frontend");
    const nav = wrapper.find("nav");
    expect(nav.exists()).toBe(true);
    const hrefs = nav.findAll("a[aria-label]").map((a) => a.attributes("href"));
    expect(hrefs).toContain("https://github.com/Fnorb/");
    expect(hrefs).toContain("mailto:aliebau79@gmail.com");
  });

  it("öffnet und schließt das Flyout über den Burger-Button (aria-expanded & v-if)", async () => {
    const wrapper = mount(Header, {
      global: { stubs: { transition: TransitionStub } },
    });
    const button = wrapper.find('button[aria-label="Toggle menu"]');
    expect(button.exists()).toBe(true);

    expect(button.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find("#header-flyout").exists()).toBe(false);

    await button.trigger("click");
    await nextTick();
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find("#header-flyout").exists()).toBe(true);

    await button.trigger("click");
    await nextTick();
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find("#header-flyout").exists()).toBe(false);
  });
});
