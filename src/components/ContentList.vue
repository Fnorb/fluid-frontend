<template>
    <section class="relative">
        <dl class="md:grid md:gap-x-6 md:gap-y-3 md:[grid-template-columns:max-content_minmax(0,1fr)]">
            <template v-for="item in data" :key="item.label + '|' + item.value">

                <!-- mobile: group each pair; desktop: wrapper disappears so grid applies -->
                <div class="space-y-1 mb-4 last:mb-0 md:contents md:space-y-0 md:mb-0">
                    <dt class="font-medium text-left">
                        {{ item.label }}
                    </dt>

                    <dd class="text-gray-300 min-w-0">
                        <component :is="item.href ? 'a' : 'span'" :href="item.href || undefined"
                            :target="item.href && isExternal(item.href) ? '_blank' : undefined"
                            :rel="item.href && isExternal(item.href) ? 'noopener noreferrer' : undefined"
                            data-print-href class="whitespace-normal break-words [overflow-wrap:anywhere]"
                            :class="item.href && 'underline underline-offset-2 decoration-dotted hover:decoration-solid'">
                            {{ item.value }}
                        </component>
                    </dd>
                </div>
            </template>
        </dl>
    </section>
</template>

<script setup lang="ts">
interface Data {
    label: string
    value: string
    href?: string
}
defineProps<{ data: Data[] }>()
const isExternal = (href: string) => /^https?:\/\//i.test(href)
</script>

<style scoped>
/* print the real URL for screenshot/print usefulness */
@media print {
    a[data-print-href]::after {
        content: " (" attr(href) ")";
    }
}
</style>
