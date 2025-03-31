import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and resolves any Tailwind CSS conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 