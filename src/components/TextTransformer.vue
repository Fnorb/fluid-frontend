<template>
    <div class="relative w-full h-full">
        <div ref="hiddenContainerRef" class="w-fit whitespace-nowrap invisible"></div>

        <div ref="visibleContainerRef" class="absolute inset-0 flex">
            <span v-for="char in visibleChars" :key="char.id" class="inline-block absolute">
                {{ char.content }}
            </span>
        </div>
    </div>
</template>


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

interface MotionPathResult {
    path: { x: number, y: number }[],
    curviness: number
}


const hiddenContainerRef = ref<HTMLElement | null>(null)
const visibleContainerRef = ref<HTMLElement | null>(null)
const hiddenChars = ref<AnimatedChar[]>([])
const visibleChars = ref<AnimatedChar[]>([])
const ANIMATION_DURATION = .8

let resizeObserver: ResizeObserver | null = null
let currentAnimationPromises: Promise<void>[] = []

const generatedId = () => Math.random().toString(36).substring(2, 9)

const calculatePositions = async () => {
    if (!hiddenContainerRef.value || !visibleContainerRef.value || props.text.length === 0) {
        return
    }

    hiddenContainerRef.value.innerHTML = ''
    const parentContainerRect = visibleContainerRef.value.parentElement?.getBoundingClientRect()

    if (!parentContainerRect) {
        console.error("Parent container not found or not positioned.")
        return
    }


    const availableWidth = parentContainerRect.width
    const charsToPlace = props.text.split('').map(char => ({
        content: char === ' ' ? '\u00A0' : char,
        originalChar: char
    }))

    for (let i = 0; i < charsToPlace.length; i++) {
        const charData = charsToPlace[i]

        const charSpan = document.createElement('span')
        charSpan.textContent = charData.content
        hiddenContainerRef.value.appendChild(charSpan)
        //await nextTick();

        const newWidth = hiddenContainerRef.value.clientWidth
        if (newWidth > availableWidth) {
            insertBreak(i)
        }
    }
    const hiddenSpans = Array.from(hiddenContainerRef.value.children) as HTMLElement[]
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

const calculateMotionPath = (
    x1: number, y1: number,
    x2: number, y2: number
): MotionPathResult => {
    const distanceTraveled = distance({ x: x1, y: y1 }, { x: x2, y: y2 });

    let controlPoint: { x: number, y: number };
    let curvinessValue = 1;

    if (distanceTraveled < 40) {
        controlPoint = {
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2 - (15 + Math.random() * 8)
        };
        curvinessValue = 1.25;
    } else {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const dx = x2 - x1;
        const dy = y2 - y1;

        const perpendicularDx = -dy;
        const perpendicularDy = dx;

        const length = Math.sqrt(perpendicularDx * perpendicularDx + perpendicularDy * perpendicularDy);
        const normalX = length === 0 ? 0 : perpendicularDx / length;
        const normalY = length === 0 ? 0 : perpendicularDy / length;

        const arcHeight = Math.min(20, distanceTraveled * 0.10);
        const randomOffsetFactor = (Math.random() - 0.5) * .6;
        const finalArcHeight = arcHeight * (1 + randomOffsetFactor);

        controlPoint = {
            x: midX + normalX * finalArcHeight,
            y: midY + normalY * finalArcHeight
        };
        curvinessValue = 1;
    }

    return {
        path: [{ x: x1, y: y1 }, controlPoint, { x: x2, y: y2 }],
        curviness: curvinessValue
    };
};

const insertBreak = (index: number) => {
    if (hiddenContainerRef.value !== null) {
        const spans = Array.from(hiddenContainerRef.value.children).slice(0, index)
        const lastNbspIndex = findLastNbspIndex(spans)
        const targetSpan = spans[lastNbspIndex]
        const lineBreak = document.createElement('span')
        lineBreak.className = 'w-full h-0 block'
        targetSpan.after(lineBreak)
    }
}

function findLastNbspIndex(spans: Element[]) {
    const reversedIndex = spans
        .slice()
        .reverse()
        .findIndex(span => span.textContent === '\u00A0')

    if (reversedIndex === -1) return -1
    return spans.length - 1 - reversedIndex
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
        const parentElement = hiddenContainerRef.value.parentElement

        if (parentElement) {
            resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.target === parentElement) {
                        debouncedRecalculate()
                    }
                }
            })

            resizeObserver.observe(parentElement)
        } else {
            console.warn("Parent element for hiddenContainerRef not found on mount. ResizeObserver not set up.")
        }
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
                        ease: "power2.inOut",
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
                        ease: "power2.inOut",
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

                    const { path, curviness } = calculateMotionPath(x1, y1, x2, y2);

                    gsap.to(char.ref!, {
                        duration: ANIMATION_DURATION,
                        ease: 'power1.inOut',
                        motionPath: {
                            path: path,
                            curviness: curviness,
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
}

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
