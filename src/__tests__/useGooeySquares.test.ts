import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import { describe, it, expect } from "vitest";
import { useGooeySquares } from "../composables/useGooeySquares";
import type { Square } from "../composables/useGooeySquares";
import type { Ref } from "vue";

describe("useGooeySquares", () => {
  it("each square has correct property ranges", async () => {
    let squares: Ref<Square[]> | undefined;

    const Dummy = defineComponent({
      setup() {
        const result = useGooeySquares(120, 20, 20);
        squares = result.squares;
        return () => null;
      },
    });

    mount(Dummy);
    await nextTick();

    expect(squares).toBeDefined();

    (squares as Ref<Square[]>).value.forEach((sq) => {
      expect(sq.x).toBeDefined();
      expect(sq.y).toBeGreaterThan(0);
      expect(sq.depthFactor).toBeGreaterThanOrEqual(0.5);
      expect(sq.depthFactor).toBeLessThanOrEqual(1);
      expect(sq.rotation).toBeGreaterThanOrEqual(0);
      expect(sq.rotation).toBeLessThanOrEqual(360);
    });
  });
});
