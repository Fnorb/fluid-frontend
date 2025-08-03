<template>
    <div class="relative w-full h-full">

        <!-- hidden container acts as a template -->
        <div ref="hiddenContainerRef" class="w-fit whitespace-nowrap invisible"></div>

        <!-- visible container takes coordinates -->
        <div ref="visibleContainerRef" class="absolute inset-0 flex">
            <span v-for="char in visibleChars" :key="char.id" class="inline-block absolute">
                {{ char.content }}
            </span>
        </div>
    </div>
</template>


<script setup lang="ts">
// imports and Plugins
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue';
import gsap from 'gsap';
import { debounce } from '../utils/debounce';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);

// prop that is passing the string
const props = withDefaults(defineProps<{
    text?: string
}>(), {
    text: ''
});

// structure of the object holding the information for the strings characters
interface AnimatedChar {
    id: string
    content: string
    task: 'move' | 'fadeIn' | 'fadeOut' | 'disappear' | '' | 'appear'
    origin?: { x: number, y: number }
    destination?: { x: number, y: number }
    ref?: HTMLElement | null
    assigned?: boolean
}

// structure of the object holding the path that characters should move along
interface MotionPathResult {
    path: { x: number, y: number }[],
    curviness: number
}

const hiddenContainerRef = ref<HTMLElement | null>(null); // container for the template div
const visibleContainerRef = ref<HTMLElement | null>(null); // container for the visible div where the animation takes place
const hiddenChars = ref<AnimatedChar[]>([]); // and array of objects describing the template content
const visibleChars = ref<AnimatedChar[]>([]); // an array of objects describing the visible content
const ANIMATION_DURATION = 1; // duration in seconds of the transformation animation (fade in, fade out and movement)

let resizeObserver: ResizeObserver | null = null; // observer watches the space available for the string
let lastObservedParentWidth: number = 0; // required for calculating linebreaks in the template div
let animationActiveCount = 0; // number of currently active animations, used to determine when all animations are done

const generatedId = () => Math.random().toString(36).substring(2, 9); // unique IDs for the template spans

// sets up the template div and measures the resting place for the characters
const calculatePositions = async () => {

    // exit unless everything necessary is available
    if (!hiddenContainerRef.value || !visibleContainerRef.value || props.text.length === 0) { return; }

    // empty template container and get the parents size    
    hiddenContainerRef.value.innerHTML = '';
    const parentContainerRect = visibleContainerRef.value.parentElement?.getBoundingClientRect();

    // ensure the parent is there
    if (!parentContainerRect) {
        console.error("Parent container not found or not positioned.");
        return;
    }


    // add the character holding spans one by one to the template container
    const availableWidth = parentContainerRect.width;
    const charsToPlace = props.text.split('').map(char => ({
        content: char === ' ' ? '\u00A0' : char,
        originalChar: char
    }));

    for (let i = 0; i < charsToPlace.length; i++) {
        const charData = charsToPlace[i];

        const charSpan = document.createElement('span');
        charSpan.textContent = charData.content;
        hiddenContainerRef.value.appendChild(charSpan);
        await nextTick();

        // add a linebreak if the template containers width the designated width
        const newWidth = hiddenContainerRef.value.clientWidth;
        if (newWidth > availableWidth) {
            insertBreak(i);
        }
    }

    // measures all required data of the template spans and stores them in an array
    const hiddenSpans = Array.from(hiddenContainerRef.value.children) as HTMLElement[];
    const newHiddenChars: AnimatedChar[] = [];

    hiddenSpans.forEach((span) => {
        const spanRect = span.getBoundingClientRect();
        const relativeX = spanRect.left - parentContainerRect.left;
        const relativeY = spanRect.top - parentContainerRect.top;
        const existingChar = hiddenChars.value.find(c => c.id === span.dataset.id);

        newHiddenChars.push({
            id: existingChar ? existingChar.id : generatedId(),
            content: span.textContent === ' ' ? '\u00A0' : span.textContent || '',
            task: existingChar ? existingChar.task : '',
            assigned: existingChar ? existingChar.assigned : true,
            origin: { x: relativeX, y: relativeY },
            destination: { x: relativeX, y: relativeY },
            ref: span,
        });
    });

    hiddenChars.value = newHiddenChars;
};

// when all GSAP animations are done, this function prunes the visible char array of no longer required spans and updates the coordinates
const animationCleanup = () => {
    animationActiveCount--;
    if (animationActiveCount == 0) {
        visibleChars.value.forEach((char) => {
            if (char.ref) {
                char.origin = char.destination;
            }
        });

        visibleChars.value = hiddenChars.value.map(c => ({
            ...c,
            origin: c.destination,
        }));
    }
};

// calculates a bezier path between two points
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

// adds a custom linebreak to the template
const insertBreak = (index: number) => {
    if (hiddenContainerRef.value !== null) {
        const spans = Array.from(hiddenContainerRef.value.children).slice(0, index);
        const lastNbspIndex = findLastNbspIndex(spans);
        const targetSpan = spans[lastNbspIndex];
        const lineBreak = document.createElement('span');
        lineBreak.className = 'w-full h-0 block';
        targetSpan.after(lineBreak);
    }
};

// finds the last nbsp to ensure that breaks do not happen inmidst of words
function findLastNbspIndex(spans: Element[]) {
    const reversedIndex = spans
        .slice()
        .reverse()
        .findIndex(span => span.textContent === '\u00A0');

    if (reversedIndex === -1) return -1;
    return spans.length - 1 - reversedIndex;
}

// assigns the refs to the visible spans
const assignVisibleElementRefs = async () => {
    if (!visibleContainerRef.value) return;

    await nextTick();

    const visibleSpans = Array.from(visibleContainerRef.value.children) as HTMLElement[];
    visibleChars.value.forEach((char, index) => {
        const span = visibleSpans[index];
        if (span && char.destination) {
            char.ref = span;
        }
    });
};

// container function that calculates the positions of the characters, assigns animation techniques, assigns refs and animates
const setToPosition = async () => {
    await calculatePositions();
    await nextTick();
    assignTasks(true);
    await assignVisibleElementRefs();
    animateChars();
};

// prevent excessive function execution on container width changes
const debouncedRecalculate = debounce(setToPosition, 100);

onMounted(async () => {

    // sets the observer to watch for width changes
    if (hiddenContainerRef.value) {
        const parentElement = hiddenContainerRef.value.parentElement;

        if (parentElement) {
            lastObservedParentWidth = parentElement.getBoundingClientRect().width;
            resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.target === parentElement) {
                        const currentParentWidth = entry.contentRect.width;
                        if (currentParentWidth !== lastObservedParentWidth) {
                            lastObservedParentWidth = currentParentWidth;
                            debouncedRecalculate();
                        }
                    }
                }
            });

            resizeObserver.observe(parentElement);
        } else {
            console.warn("Parent element for hiddenContainerRef not found on mount. ResizeObserver not set up.");
        }
    } else {
        console.warn("hiddenContainerRef not found on mount. Cannot set up ResizeObserver.");
    }

    setToPosition();
});

// disconnects the observer
onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});

// animates the characters
const animateChars = () => {
    if (!visibleContainerRef.value) return;

    // iterate through each character to assign it its animation
    const animations: Promise<void>[] = [];
    visibleChars.value.forEach((char) => {
        if (char.ref) {
            const { x: x1, y: y1 } = char.origin!;
            const { x: x2, y: y2 } = char.destination!;

            // reduces a characters opacity to 0 while moving it downwards out of its line
            if (char.task === 'fadeOut') {
                animationActiveCount++;
                animations.push(new Promise(resolve => {
                    gsap.set(char.ref!, {
                        x: x2,
                        y: y2,
                        opacity: 1
                    });
                    gsap.to(char.ref!, {
                        duration: ANIMATION_DURATION,
                        opacity: 0,
                        y: y2 + 20,
                        ease: "power2.inOut",
                        onComplete: () => {
                            animationCleanup();
                            resolve();
                        }
                    });
                }));
            }

            // increase a characters opacity to 1 while moving it downwards into its line
            else if (char.task === 'fadeIn') {
                animationActiveCount++;
                animations.push(new Promise(resolve => {
                    gsap.set(char.ref!, {
                        x: x2,
                        y: y2 - 20,
                        opacity: 0
                    });
                    gsap.to(char.ref!, {
                        duration: ANIMATION_DURATION,
                        opacity: 1,
                        y: y2,
                        ease: "power2.inOut",
                        onComplete: () => {
                            animationCleanup();
                            resolve();
                        }
                    });
                }));
            }

            // move the character from its previous spot to the new spot
            else if (char.task === 'move') {
                animationActiveCount++;
                animations.push(new Promise(resolve => {
                    const { path, curviness } = calculateMotionPath(x1, y1, x2, y2);
                    gsap.set(char.ref!, {
                        x: x1,
                        y: y1,
                    });

                    gsap.to(char.ref!, {
                        duration: ANIMATION_DURATION,
                        ease: 'power1.inOut',
                        motionPath: {
                            path: path,
                            curviness: curviness,
                            autoRotate: false
                        },
                        onComplete: () => {
                            animationCleanup();
                            resolve();
                        }
                    });
                }));
            }

            // characters appear without animation with full opacity in the target position
            else if (char.task === 'appear') {
                gsap.set(char.ref!, {
                    x: char.destination ? char.destination.x : 0,
                    y: char.destination ? char.destination.y : 0,
                    opacity: 1
                });
            }

            // characters disappear without animation
            else if (char.task === 'disappear') {
                gsap.set(char.ref!, {
                    x: char.destination ? char.destination.x : 0,
                    y: char.destination ? char.destination.y : 0,
                    opacity: 0
                });
            }
        }
    });

    // get rid of no longer needed spans (those whose opacity became 0)
    Promise.all(animations).then(() => {
        visibleChars.value = visibleChars.value.filter(c => c.task !== 'fadeOut' && c.task !== 'disappear');
    });
};

// assigns the correct animation to each character
const assignTasks = (firstRender = false) => {
    // no animation needed on first render
    if (firstRender) {
        visibleChars.value = hiddenChars.value.map(c => ({
            ...c,
            origin: c.destination,
        }));

        visibleChars.value.forEach(char => { char.assigned = true; char.task = 'appear'; });
        hiddenChars.value.forEach(char => { char.assigned = true; char.task = 'appear'; });
        return;
    }

    // set all characters to have no animation assigned
    visibleChars.value.forEach(char => { char.assigned = false; });
    hiddenChars.value.forEach(char => { char.assigned = false; });

    // iterate through all characters of the new string to ensure they all become displayed
    hiddenChars.value.forEach(newChar => {
        const candidates = visibleChars.value.filter(oldChar =>
            !oldChar.assigned && oldChar.content === newChar.content
        );

        if (candidates.length === 0) { // if a character is required in the new string but has no counterpart in the old string, it appears
            newChar.origin = { ...newChar.destination! };
            newChar.task = 'fadeIn';
            newChar.assigned = true;
        } else if (candidates.length === 1) { // if a new character appears once in the old string, it is pair to move into its new position
            const match = candidates[0];
            match.assigned = true;
            newChar.origin = { ...match.origin! };
            newChar.task = 'move';
            newChar.assigned = true;
        } else { // if multiple characters of the old string are candidates for a new character, pick the closest one
            let closest = candidates[0];
            let minDist = distance(newChar.destination!, candidates[0].origin!);
            for (let i = 1; i < candidates.length; i++) {
                const dist = distance(newChar.destination!, candidates[i].origin!);
                if (dist < minDist) {
                    minDist = dist;
                    closest = candidates[i];
                }
            }
            closest.assigned = true;
            newChar.origin = { ...closest.origin! };
            newChar.task = 'move';
            newChar.assigned = true;
        }
    });

    // all old characters that have no task are no longer needed and fade out
    visibleChars.value.forEach(oldChar => {
        if (!oldChar.assigned) {
            oldChar.task = 'fadeOut';
            oldChar.assigned = true;
        }
    });

    // the visible string consists of the new string as well as all characters from the old string that are no longer needed (so that they can fade out)
    const allChars: AnimatedChar[] = [...hiddenChars.value];
    visibleChars.value.forEach(oldChar => {
        if (oldChar.task === 'fadeOut') {
            allChars.push(oldChar);
        }
    });

    visibleChars.value = allChars;
};

// calculate the distance between two points, necessary to find the closest matching character
const distance = (a: { x: number, y: number }, b: { x: number, y: number }) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};

// watch the prop for changes
watch(() => props.text, async (newText, oldText) => {

    // if for any reason the new text is the same as the old one, do nothing
    if (newText === oldText) {
        return;
    }

    // if there was a text and the new prop value is empty, fade out all characters
    if (newText.length === 0 && oldText.length > 0) {
        visibleChars.value.forEach(char => {
            char.task = 'fadeOut';
        });
        await nextTick();
        animateChars();
    }
    // if there was no old text and a text is passed, fade in all characters 
    else if (newText.length > 0 && oldText.length === 0) {
        hiddenChars.value = newText.split('').map(char => ({
            id: generatedId(),
            content: char === ' ' ? '\u00A0' : char,
            task: 'fadeIn',
            assigned: true,
        }));
        await nextTick();
        await calculatePositions();
        await nextTick();
        await assignVisibleElementRefs();
        animateChars();
    }
    // if there was an old text and there is a different new value passed, do the entire transformation
    else if (newText.length > 0 && oldText.length > 0) {
        hiddenChars.value = [];
        await nextTick();

        hiddenChars.value = newText.split('').map(char => ({
            id: generatedId(),
            content: char === ' ' ? '\u00A0' : char,
            task: '',
            assigned: true,
        }));
        await nextTick();
        await calculatePositions();
        assignTasks();
        await assignVisibleElementRefs();
        animateChars();
    }
});
</script>
