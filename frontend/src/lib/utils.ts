import confetti from "canvas-confetti"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Skill } from "./types"

export function needsPrerequisites(skill: Skill): boolean {
  return skill.level === "advanced"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function toSlug(input: string): string {
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

export const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return new Date(timestamp).toLocaleDateString();
};


export function triggerConfetti() {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 1000,
  }

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    origin: { y: 0.7 },
  })

  fire(0.2, {
    spread: 60,
    origin: { y: 0.7 },
  })

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    origin: { y: 0.7 },
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    origin: { y: 0.7 },
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    origin: { y: 0.7 },
  })
}

