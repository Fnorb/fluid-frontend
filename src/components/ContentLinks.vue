<template>
    <section class="relative">
        <!-- 1 col on small screens, 2 cols from md up -->
        <dl class="grid gap-x-6 gap-y-3
             [grid-template-columns:1fr]
             md:[grid-template-columns:max-content_minmax(0,1fr)]">
            <template v-for="element in data" :key="element.value">
                <dt class="font-medium text-left">
                    {{ element.label }}
                </dt>
                <dd class="text-gray-300">
                    <a :href="element.value" target="_blank" rel="noopener noreferrer"
                        class="underline underline-offset-2 decoration-dotted hover:decoration-solid break-words">
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
