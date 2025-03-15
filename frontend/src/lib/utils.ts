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