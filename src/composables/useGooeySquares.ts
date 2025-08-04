import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";

// define the structure of objects containing the data for the animated squares
export interface Square {
  x: number;
  y: number;
  rotation: number;
  depthFactor: number;
}

// set button size, vertical and rotation speeds
const MAX_ROTATION_SPEED = 30;
const BASE_SPEED = 120;
const SQUARE_HEIGHT = 40;

// generate squares and attempt to distribute them evenly in the defined area
function generateSquares(
  count: number,
  areaWidth: number,
  areaHeight: number,
  minDistance: number,
  maxAttempts: number = 30
): Square[] {
  const placed: Square[] = [];

  for (let i = 0; i < count; i++) {
    let bestLocation: { x: number; y: number; dist: number } | null = null;

    // try up to maxAttempts often to place the button
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const candidateX = Math.random() * areaWidth;
      const candidateY = Math.random() * areaHeight;

      let minDist = Infinity;
      for (const sq of placed) {
        const dist = Math.hypot(sq.x - candidateX, sq.y - candidateY);
        if (dist < minDist) minDist = dist;
      }

      // remember the so far best location
      if (!bestLocation || minDist > bestLocation.dist) {
        bestLocation = { x: candidateX, y: candidateY, dist: minDist };
      }
    }

    // if a best location has been found and the distance to other squares exceeds the set minimum, place the square there
    if (bestLocation && bestLocation.dist >= minDistance) {
      placed.push({
        x: bestLocation.x,
        y: bestLocation.y,
        rotation: Math.random() * 360,
        depthFactor: 0.5 + Math.random() * 0.5,
      });
      // otherwise skip the square
    } else {
      console.warn(
        `Skipping square ${i}: no good placement found after ${maxAttempts} attempts`
      );
    }
  }
  return placed;
}

// animate the squares and reset their position should they leave the viewport
export function useGooeySquares(
  columnWidth: number,
  squareCount: number,
  minDistance: number
) {
  const squares = ref<Square[]>([]);
  const animations: gsap.core.Tween[] = [];

  const animateSquare = (
    elNormal: HTMLElement,
    elGooey: HTMLElement,
    startX: number,
    startY: number,
    depthFactor: number
  ) => {
    const endY = -SQUARE_HEIGHT;
    const distance = startY - endY;

    const speed = BASE_SPEED * depthFactor;
    const duration = distance / speed;

    const rotationSpeed = (Math.random() * 2 - 1) * MAX_ROTATION_SPEED;
    const startRotation = Math.random() * 360;
    const endRotation = startRotation + rotationSpeed * duration;

    // sets the normal and gooey square back to start
    gsap.set(elNormal, {
      x: startX,
      y: startY,
      rotation: startRotation,
      scale: depthFactor,
      borderRadius: "0px",
    });

    gsap.set(elGooey, {
      x: startX,
      y: startY,
      rotation: startRotation,
      scale: 0.5 * depthFactor,
    });

    // starts the move animation for the normal and gooey square, speed relative to scale
    const normalTween = gsap.to(elNormal, {
      y: endY,
      rotation: endRotation,
      scale: 0.5 * depthFactor,
      borderRadius: "20px",
      duration,
      ease: "none",
    });

    const gooeyTween = gsap.to(elGooey, {
      y: endY,
      rotation: endRotation,
      scale: depthFactor,
      duration,
      ease: "none",
      onComplete: () => {
        const newX = Math.random() * columnWidth;
        const newY = window.innerHeight + SQUARE_HEIGHT;
        animateSquare(elNormal, elGooey, newX, newY, 0.5 + Math.random() * 0.5);
      },
    });

    animations.push(normalTween, gooeyTween);
  };

  // init squares on mount
  onMounted(() => {
    squares.value = generateSquares(
      squareCount,
      columnWidth,
      window.innerHeight,
      minDistance
    );
  });

  // stop animations on unmount
  onBeforeUnmount(() => {
    animations.forEach((tween) => tween.kill());
  });

  return {
    squares,
    animateSquare,
  };
}
