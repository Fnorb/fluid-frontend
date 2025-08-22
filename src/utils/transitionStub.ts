import { defineComponent, h } from "vue";

export const TransitionStub = defineComponent({
  name: "Transition",
  inheritAttrs: false, // verhindert Extraneous-Warnungen
  props: {
    enterActiveClass: String,
    leaveActiveClass: String,
  },
  setup(_, { slots, attrs }) {
    // rendert sofort, konsumiert attrs, kein Delay
    return () => h("div", attrs, slots.default ? slots.default() : []);
  },
});
