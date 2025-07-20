<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { debounce } from '../utils/debounce'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(MotionPathPlugin)

const props = withDefaults(defineProps<{
    text?: string
}>(), {
    text: ''
})

interface AnimatedChar {
    id: string
    content: string
    task: 'move' | 'fadeIn' | 'fadeOut' | 'show' | 'hide' | ''
    origin?: { x: number, y: number }
    destination?: { x: number, y: number }
    ref?: HTMLElement | null
    assigned?: boolean
}

const hiddenContainerRef = ref<HTMLElement | null>(null)
const visibleContainerRef = ref<HTMLElement | null>(null)
const hiddenChars = ref<AnimatedChar[]>([])
const visibleChars = ref<AnimatedChar[]>([])
const ANIMATION_DURATION = 1

let resizeObserver: ResizeObserver | null = null
let currentAnimationPromises: Promise<void>[] = []

const generatedId = () => Math.random().toString(36).substring(2, 9)


const calculatePositions = async () => {
    if (!hiddenContainerRef.value || !visibleContainerRef.value || props.text.length === 0) {
        return
    }

    const hiddenSpans = Array.from(hiddenContainerRef.value.children) as HTMLElement[]
    const parentContainerRect = visibleContainerRef.value.parentElement?.getBoundingClientRect()

    if (!parentContainerRect) {
        console.error("Parent container not found or not positioned.")
        return
    }

    const newHiddenChars: AnimatedChar[] = []
    hiddenSpans.forEach((span, index) => {
        const spanRect = span.getBoundingClientRect()
        const relativeX = spanRect.left - parentContainerRect.left
        const relativeY = spanRect.top - parentContainerRect.top

        const existingChar = hiddenChars.value.find(c => c.id === span.dataset.id)

        newHiddenChars.push({
            id: existingChar ? existingChar.id : generatedId(),
            content: span.textContent === ' ' ? '\u00A0' : span.textContent || '',
            task: existingChar ? existingChar.task : '',
            assigned: existingChar ? existingChar.assigned : true,
            origin: { x: relativeX, y: relativeY },
            destination: { x: relativeX, y: relativeY },
            ref: span,
        })
    })

    hiddenChars.value = newHiddenChars
}

const applyPositions = async () => {
    if (!visibleContainerRef.value) return

    visibleChars.value = hiddenChars.value.map(c => ({
        ...c,
        ref: null,
        origin: c.origin ? { ...c.origin } : undefined,
        destination: c.destination ? { ...c.destination } : undefined,
    }))

    await nextTick()

    const visibleSpans = Array.from(visibleContainerRef.value.children) as HTMLElement[]

    visibleChars.value.forEach((char, index) => {
        const span = visibleSpans[index]

        if (span && char.destination) {
            gsap.set(span, {
                x: char.destination.x,
                y: char.destination.y,
                opacity: (char.task === 'fadeIn' || char.task === 'fadeOut') ? 0 : 1
            })

            char.ref = span
        }
    })
}

const calculateAndApplyPositions = async () => {
    calculatePositions()
    await nextTick()
    applyPositions()
}


const debouncedRecalculate = debounce(calculateAndApplyPositions, 100)

onMounted(async () => {
    if (props.text.length > 0) {
        hiddenChars.value = props.text.split('').map(char => ({
            id: generatedId(),
            content: char === ' ' ? '\u00A0' : char,
            task: 'hide',
            assigned: true,
        }))
        await nextTick()
    }

    if (hiddenContainerRef.value) {
        resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === hiddenContainerRef.value) {
                    debouncedRecalculate()
                }
            }
        })

        resizeObserver.observe(hiddenContainerRef.value)
    } else {
        console.warn("hiddenContainerRef not found on mount. Cannot set up ResizeObserver.")
    }

    await calculateAndApplyPositions()
})

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect()
    }
})

const animateChars = () => {
    if (!visibleContainerRef.value) return

    const animations: Promise<void>[] = []

    visibleChars.value.forEach((char) => {
        if (char.ref) {
            if (char.task === 'fadeOut') {
                animations.push(new Promise(resolve => {
                    gsap.to(char.ref!, {
                        duration: ANIMATION_DURATION,
                        opacity: 0,
                        ease: "power2.out",
                        onComplete: () => {
                            resolve()
                        }
                    })
                }))
            }
            else if (char.task === 'fadeIn') {
                animations.push(new Promise(resolve => {
                    gsap.set(char.ref!, {
                        opacity: 0
                    })
                    gsap.to(char.ref!, {
                        duration: ANIMATION_DURATION,
                        opacity: 1,
                        ease: "power2.out",
                        onComplete: () => {
                            char.task = 'show'
                            resolve()
                        }
                    })
                }))
            }
            else if (char.task === 'move') {
                animations.push(new Promise(resolve => {
                    const { x: x1, y: y1 } = char.origin!
                    const { x: x2, y: y2 } = char.destination!

                    const controlPoint = {
                        x: (x1 + x2) / 2,
                        y: (y1 + y2) / 2 - 15 + Math.random() * 10
                    }

                    gsap.to(char.ref!, {
                        duration: ANIMATION_DURATION,
                        ease: 'power2.out',
                        motionPath: {
                            path: [{ x: x1, y: y1 }, controlPoint, { x: x2, y: y2 }],
                            curviness: 1.25,
                            autoRotate: false
                        },
                        onComplete: () => {
                            char.task = 'show'
                            resolve()
                        }
                    })
                }))
            }

        }
    })

    Promise.all(animations).then(() => {
        visibleChars.value = visibleChars.value.filter(c => c.task !== 'fadeOut')
    })
}

const assignTasks = () => {
    visibleChars.value.forEach(char => { char.assigned = false })
    hiddenChars.value.forEach(char => { char.assigned = false })

    hiddenChars.value.forEach(newChar => {
        const candidates = visibleChars.value.filter(oldChar =>
            !oldChar.assigned && oldChar.content === newChar.content
        )

        if (candidates.length === 0) {
            newChar.origin = { ...newChar.destination! }
            newChar.task = 'fadeIn'
            newChar.assigned = true
        } else if (candidates.length === 1) {
            const match = candidates[0]
            match.assigned = true
            newChar.origin = { ...match.origin! }
            newChar.task = 'move'
            newChar.assigned = true
        } else {
            let closest = candidates[0]
            let minDist = distance(newChar.destination!, candidates[0].origin!)
            for (let i = 1; i < candidates.length; i++) {
                const dist = distance(newChar.destination!, candidates[i].origin!)
                if (dist < minDist) {
                    minDist = dist
                    closest = candidates[i]
                }
            }
            closest.assigned = true
            newChar.origin = { ...closest.origin! }
            newChar.task = 'move'
            newChar.assigned = true
        }
    })

    visibleChars.value.forEach(oldChar => {
        if (!oldChar.assigned) {
            oldChar.task = 'fadeOut'
            oldChar.assigned = true
        }
    })

    const allChars: AnimatedChar[] = [...hiddenChars.value]

    visibleChars.value.forEach(oldChar => {
        if (oldChar.task === 'fadeOut') {
            allChars.push(oldChar)
        }
    })

    visibleChars.value = allChars
}

const distance = (a: { x: number, y: number }, b: { x: number, y: number }) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
};

watch(() => props.text, async (newText, oldText) => {
    if (newText === oldText) {
        return
    }

    if (newText.length === 0 && oldText.length > 0) {
        visibleChars.value.forEach(char => {
            char.task = 'fadeOut'
        })
        await nextTick()
        animateChars()
    }
    else if (newText.length > 0 && oldText.length === 0) {
        hiddenChars.value = newText.split('').map(char => ({
            id: generatedId(),
            content: char === ' ' ? '\u00A0' : char,
            task: 'fadeIn',
            assigned: true,
        }))
        await nextTick()

        await calculateAndApplyPositions()
        animateChars()
    }
    else if (newText.length > 0 && oldText.length > 0) {
        hiddenChars.value = []
        await nextTick()

        hiddenChars.value = newText.split('').map(char => ({
            id: generatedId(),
            content: char === ' ' ? '\u00A0' : char,
            task: '',
            assigned: true,
        }))
        await nextTick()
        await calculatePositions()
        assignTasks()
        await applyPositions()
        animateChars()
    }
})
</script>

<template>
    <div class="relative w-full h-full">
        <div ref="hiddenContainerRef" class="flex invisible flex-wrap">
            <span v-for="char in hiddenChars" :key="char.id" class="inline-block" :data-id="char.id">
                {{ char.content }}
            </span>
        </div>

        <div ref="visibleContainerRef" class="absolute inset-0 flex">
            <span v-for="char in visibleChars" :key="char.id" class="inline-block absolute">
                {{ char.content }}
            </span>
        </div>
    </div>
</template>
