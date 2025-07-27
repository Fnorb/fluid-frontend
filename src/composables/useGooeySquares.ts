import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";

interface Square {
  x: number;
  y: number;
  rotation: number;
  depthFactor: number;
}

const MAX_ROTATION_SPEED = 30;
const BASE_SPEED = 120;
const SQUARE_HEIGHT = 40;

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

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const candidateX = Math.random() * areaWidth;
      const candidateY = Math.random() * areaHeight;

      let minDist = Infinity;
      for (const sq of placed) {
        const dist = Math.hypot(sq.x - candidateX, sq.y - candidateY);
        if (dist < minDist) minDist = dist;
      }

      if (!bestLocation || minDist > bestLocation.dist) {
        bestLocation = { x: candidateX, y: candidateY, dist: minDist };
      }
    }

    if (bestLocation && bestLocation.dist >= minDistance) {
      placed.push({
        x: bestLocation.x,
        y: bestLocation.y,
        rotation: Math.random() * 360,
        depthFactor: 0.5 + Math.random() * 0.5,
      });
    } else {
      console.warn(
        `Skipping square ${i}: no good placement found after ${maxAttempts} attempts`
      );
    }
  }
  return placed;
}

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

    // RESET
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

    // ANIMATION
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

  onMounted(() => {
    squares.value = generateSquares(
      squareCount,
      columnWidth,
      window.innerHeight,
      minDistance
    );
  });

  onBeforeUnmount(() => {
    animations.forEach((tween) => tween.kill());
  });

  return {
    squares,
    animateSquare,
  };
}
