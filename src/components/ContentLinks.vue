<template>
    <section class="relative">
        <!-- 1 col on small screens, 2 cols from md up -->
        <dl class="grid gap-x-6 gap-y-3
             [grid-template-columns:1fr]
             md:[grid-template-columns:max-content_minmax(0,1fr)]">
            <template v-for="link in links" :key="link.href">
                <dt class="text-gray-300 font-medium text-left">
                    {{ link.label }}
                </dt>
                <dd class="text-white">
                    <a :href="link.href" target="_blank" rel="noopener"
                        class="underline underline-offset-2 decoration-dotted hover:decoration-solid break-words">
                        {{ link.href }}
                    </a>
                </dd>
            </template>
        </dl>
    </section>
</template>

<script setup lang="ts">
const links = [
    { label: 'GitHub', href: 'https://github.com/yourname' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yourname' },
    { label: 'Website', href: 'https://yourdomain.com' },
];
</script>
