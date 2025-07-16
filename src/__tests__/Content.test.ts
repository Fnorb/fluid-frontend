import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Content from '../components/Content.vue';

describe('Content', () => {
    it('renders multiple paragraphs', () => {
        const wrapper = mount(Content);
        const paragraphs = wrapper.findAll('p');
        expect(paragraphs.length).toBeGreaterThan(1);
    })
})