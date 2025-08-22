import { mount } from "@vue/test-utils";
import AppContent from "../components/AppContent.vue";
import { describe, it, expect } from "vitest";

describe("AppContent.vue", () => {
  it("rendert die Hauptabschnitte", async () => {
    const wrapper = mount(AppContent, {
      global: {
        stubs: {
          TextTransformer: { template: "<div />" },
        },
      },
    });

    const text = wrapper.text();
    expect(text).toContain("Arkadij Liebau - Frontend Craftsman");
    expect(text).toContain("Skills");
    expect(text).toContain("Tech Stack");
    expect(text).toContain("Interessen");
    expect(text).toContain("Links");
  });
});
