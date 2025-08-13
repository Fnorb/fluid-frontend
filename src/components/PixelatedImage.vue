<template>
    <canvas :ref="(el) => (canvasData.canvas = el as HTMLCanvasElement)" />
</template>

<script lang="ts" setup>
import { onMounted, watch, reactive } from 'vue';

type CanvasData = {
    ctx: CanvasRenderingContext2D | null
    canvas: HTMLCanvasElement | null
    width: number
    height: number
    animating: boolean
    rafId?: number
    animStartTime: number
    startPixelation: number
    endPixelation: number
    currentPixelation: number
};

const canvasData = reactive<CanvasData>({
    ctx: null,
    canvas: null,
    width: 0,
    height: 0,
    animating: false,
    rafId: undefined,
    animStartTime: 0,
    startPixelation: 0,
    endPixelation: 0,
    currentPixelation: 0
});

const props = withDefaults(defineProps<{
    image: string
    width?: number
    height?: number
    pixelation?: number
    duration?: number
    animated?: boolean
}>(), {
    pixelation: 0.5,
    duration: 1500,
    animated: false,
});

const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    });

function calculateCanvasSize(
    img: HTMLImageElement,
    width?: number,
    height?: number
) {
    const r = img.naturalWidth / img.naturalHeight
    if (width && height) return { width, height }
    if (width) return { width, height: Math.round(width / r) }
    if (height) return { width: Math.round(height * r), height }
    return { width: img.naturalWidth, height: img.naturalHeight }
}
async function updateImage(pixelationOverride?: number) {
    if (!props.image || !canvasData.canvas) return
    const px = pixelationOverride ?? props.pixelation
    const img = await loadImage(props.image)
    await img.decode?.().catch(() => { })

    const { width, height } = calculateCanvasSize(img, props.width, props.height)

    const c = canvasData.canvas
    c.width = width
    c.height = height
    canvasData.width = width
    canvasData.height = height


    const ctx = (canvasData.ctx ||= c.getContext('2d'))
    if (!ctx) return

    const tmpWidth = Math.max(1, Math.round(width ** (1 - px)));
    const tmpHeight = Math.max(1, Math.round(height ** (1 - px)));

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = tmpWidth
    tempCanvas.height = tmpHeight
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    tempCtx.drawImage(img, 0, 0, tmpWidth, tmpHeight)

    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(tempCanvas, 0, 0, width, height)
}

function startPixelationAnimation(from: number, to: number) {
    if (canvasData.rafId) {
        cancelAnimationFrame(canvasData.rafId)
        canvasData.rafId = undefined
    }

    if (from === to) {
        canvasData.animating = false
        updateImage(to)
        return
    }

    canvasData.animating = true
    canvasData.startPixelation = from
    canvasData.endPixelation = to
    canvasData.animStartTime = performance.now()

    const tick = (now: number) => {
        const elapsed = now - canvasData.animStartTime
        const t = Math.min(1, elapsed / props.duration)

        const value =
            canvasData.startPixelation + (canvasData.endPixelation - canvasData.startPixelation) * t

        updateImage(value)

        if (t < 1) {
            canvasData.rafId = requestAnimationFrame(tick)
        } else {
            updateImage(canvasData.endPixelation)
            canvasData.animating = false
            canvasData.rafId = undefined
        }
    }

    canvasData.rafId = requestAnimationFrame(tick)
}

// watch(() => props.image, updateImage, { immediate: true })

watch(() => props.pixelation, (newVal, oldVal) => {
    if (!props.animated) {
        updateImage()
    } else {
        startPixelationAnimation(oldVal, newVal);
    }
})

onMounted(() => {
    if (canvasData.canvas && !canvasData.ctx) {
        canvasData.ctx = canvasData.canvas.getContext('2d')
    }
    updateImage()
})
</script>