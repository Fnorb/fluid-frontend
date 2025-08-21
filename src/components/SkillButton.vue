<template>
    <!-- a glassy squircle button with Firefox fallback to rounded corners -->
    <button class="buttons button-fallback relative px-6 py-3 text-teal-200 font-semibold
         bg-[rgba(255,255,255,0.03)]
         backdrop-blur-md
         [--squircle-radius:16]
         [--squircle-smooth:1.6]
         [mask-image:paint(squircle)]
         [mask-repeat:no-repeat]
         [mask-size:100%_100%]
         whitespace-nowrap
         overflow-hidden cursor-pointer group transition-all duration-300 ease-in-out
         justify-self-stretch filter
         bg-[linear-gradient(to_right,rgba(0,128,128,0.2)_0%,rgba(0,128,128,0.0)_30%)]
         hover:brightness-225" :class="{ 'brightness-150': isActive, 'bg-black/30': !isActive }"
        @click="$emit('select')">

        <!-- hover effect that works with the squircle -->
        <span
            class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,0))] opacity-0 group-hover:opacity-50 transition-opacity duration-300 ease-in-out pointer-events-none"></span>

        <!-- label -->
        <span class="relative z-10">{{ skillName }}</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    skillName: string;
    isActive: boolean;
}>();

defineEmits(['select']);
</script>

<style scoped>
/* Firefox fallback */
@supports not (mask-image: paint(squircle)) {
    .button-fallback {
        border-radius: 16px;
    }
}
</style>