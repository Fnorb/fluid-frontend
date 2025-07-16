import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { GooeySquares } from '../components/GooeySquares.vue';

describe('Gooey Squares', () => {
    it('renders multiple squares', () => {
        const wrapper = mount(GooeySquares);
        const squares = wrapper.findAll('.square');
        expect(squares.length).toBeGreaterThanOrEqual(1);
    })
})