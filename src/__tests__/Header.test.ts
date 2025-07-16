import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';
import Header from '../components/Header.vue';



describe('Header', () => {
    it('renders the head text', () => {
        const wrapper = mount(Header);
        expect(wrapper.text()).toContain('Web Presentation');
    })

    it('has the correct background color class', () => {
        const wrapper = mount(Header);
        expect(wrapper.classes()).toContain('bg-green-300');
    })
})

describe('App.vue', () => {
    it('includes the header component', () => {
        const wrapper = mount(App);
        expect(wrapper.findComponent({name: 'Header'}).exists()).toBe(true);
    })
})