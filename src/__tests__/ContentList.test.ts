import { mount } from "@vue/test-utils";
import ContentList from "../components/ContentList.vue";
import { describe, it, expect } from "vitest";

describe("ContentList.vue", () => {
  const data = [
    {
      label: "GitHub",
      value: "github.com/Fnorb",
      href: "https://github.com/Fnorb/",
    },
    {
      label: "Mail",
      value: "aliebau79@gmail.com",
      href: "mailto:aliebau79@gmail.com",
    },
    { label: "Phone", value: "0151 26856489", href: "tel:015126856489" },
    { label: "Name", value: "Arkadij Liebau" },
  ];

  it("rendert dt/dd-Paare und Werte", () => {
    const wrapper = mount(ContentList, { props: { data } });
    const dts = wrapper.findAll("dt");
    const dds = wrapper.findAll("dd");
    expect(dts).toHaveLength(data.length);
    expect(dds).toHaveLength(data.length);

    data.forEach((item, i) => {
      expect(dts[i].text()).toBe(item.label);
      expect(dds[i].text()).toContain(item.value);
    });
  });

  it("rendert <a> für href und <span> ohne href; setzt target/rel nur bei http(s)", () => {
    const wrapper = mount(ContentList, { props: { data } });
    const dds = wrapper.findAll("dd");

    const aGithub = dds[0].find("a");
    expect(aGithub.exists()).toBe(true);
    expect(aGithub.attributes("href")).toBe("https://github.com/Fnorb/");
    expect(aGithub.attributes("target")).toBe("_blank");
    expect(aGithub.attributes("rel")).toBe("noopener noreferrer");

    const aMail = dds[1].find("a");
    expect(aMail.exists()).toBe(true);
    expect(aMail.attributes("href")).toBe("mailto:aliebau79@gmail.com");
    expect(aMail.attributes("target")).toBeUndefined();
    expect(aMail.attributes("rel")).toBeUndefined();

    const aTel = dds[2].find("a");
    expect(aTel.exists()).toBe(true);
    expect(aTel.attributes("href")).toBe("tel:015126856489");
    expect(aTel.attributes("target")).toBeUndefined();
    expect(aTel.attributes("rel")).toBeUndefined();

    const spanName = dds[3].find("span");
    expect(spanName.exists()).toBe(true);
    expect(dds[3].find("a").exists()).toBe(false);
  });

  it("vergibt Unterstreichungs-Klassen nur bei Links (optional, robust)", () => {
    const wrapper = mount(ContentList, { props: { data } });
    const dds = wrapper.findAll("dd");
    const linkClasses = dds[0].find("a").attributes("class") || "";
    expect(linkClasses).toContain("underline");

    const spanClasses = dds[3].find("span").attributes("class") || "";
    expect(spanClasses.includes("underline")).toBe(false);
  });
});
