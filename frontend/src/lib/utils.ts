import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Skill } from "./types"

export function needsPrerequisites(skill: Skill): boolean {
  return skill.level === "advanced"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

