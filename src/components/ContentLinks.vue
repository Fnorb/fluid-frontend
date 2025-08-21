<template>
    <section class="relative">
        <dl class="grid gap-x-6 gap-y-1 md:gap-y-3
         [grid-template-columns:1fr]
         md:[grid-template-columns:max-content_minmax(0,1fr)]">
            <template v-for="element in data" :key="element.value">
                <dt class="font-medium text-left">
                    {{ element.label }}
                </dt>

                <dd class="text-gray-300 min-w-0 mb-6 last:mb-0 md:mb-0">
                    <a :href="element.value" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 decoration-dotted hover:decoration-solid
               whitespace-normal break-words [overflow-wrap:anywhere]">
                        {{ element.value }}
                    </a>
                </dd>
            </template>
        </dl>

    </section>
</template>


<script setup lang="ts">
interface Data {
    label: string
    value: string
}

defineProps<{
    data: Data[]
}>()
</script>
