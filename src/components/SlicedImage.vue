<template>
    <div>
        <canvas ref="canvas" class="rounded-r-[10px]" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

const props = defineProps<{
    src: string;
    slices: number[];
    gap?: number;
}>();

const gap = computed(() => props.gap ?? 0);
const canvas = ref<HTMLCanvasElement | null>(null);
const naturalSize = ref<{ w: number, h: number } | null>(null);
const image = ref<HTMLImageElement | null>(null);

// Get the natural size of the image
onMounted(() => {
    const img = new Image();
    img.onload = () => {
        naturalSize.value = { w: img.naturalWidth, h: img.naturalHeight };
        image.value = img;
        drawSlices();
    };
    img.src = props.src;
});

// Watch for changes in props and redraw

const drawSlices = () => {
    if (!canvas.value || !image.value || !naturalSize.value) {
        return;
    }

    const ctx = canvas.value.getContext('2d');
    if (!ctx) {
        return;
    }

    const totalWidth = naturalSize.value.w + (props.slices.length - 1) * gap.value;
    canvas.value.width = totalWidth;
    canvas.value.height = naturalSize.value.h;

    let currentX = 0;
    const slicesSum = props.slices.reduce((sum, s) => sum + s, 0);

    props.slices.forEach((slicePercentage, i) => {
        // Calculate the width of the slice in pixels
        const sliceWidth = (slicePercentage / 100) * naturalSize.value!.w;

        // Draw the slice
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctx.drawImage(
            image.value!,
            currentX, 0, // Source X, Y
            sliceWidth, naturalSize.value!.h, // Source Width, Height
            currentX + i * gap.value, 0, // Destination X, Y
            sliceWidth, naturalSize.value!.h // Destination Width, Height
        );

        currentX += sliceWidth;
    });
};
watch([naturalSize, () => props.slices, gap], drawSlices);
</script>