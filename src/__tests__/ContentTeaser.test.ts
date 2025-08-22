import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import ContentTeaser from "../components/ContentTeaser.vue";
import { describe, it, expect } from "vitest";
import ProfilePhoto from "../assets/ProfilBild.jpg";

const SlicedStub = defineComponent({
  name: "SlicedImage",
  props: { src: String, slices: Array, gap: Number },
  template: `<div data-sliced-stub="1" />`,
});

describe("ContentTeaser.vue", () => {
  it("rendert alle Listeneinträge", () => {
    const wrapper = mount(ContentTeaser, {
      global: { stubs: { SlicedImage: SlicedStub } },
    });
    const items = wrapper.findAll("li");
    expect(items.length).toBe(6);
    expect(wrapper.text()).toContain("Frontend-Entwickler");
    expect(wrapper.text()).toContain("IHK-geprüfter Ausbilder");
  });

  it("übergibt korrekte Props an <SlicedImage>", () => {
    const wrapper = mount(ContentTeaser, {
      global: { stubs: { SlicedImage: SlicedStub } },
    });

    const stub = wrapper.findComponent(SlicedStub);
    expect(stub.exists()).toBe(true);

    const props = stub.props();
    expect(props.src).toBe(ProfilePhoto);
    expect(props.slices).toEqual([3, 10, 87]);
    expect(props.gap).toBe(5);
  });
});
