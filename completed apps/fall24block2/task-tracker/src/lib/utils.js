import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
 
/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for proper override behavior
 * 
 * @param {...any} inputs - Class names, objects, or arrays to merge
 * @returns {string} - Merged class string
 * 
 * Example usage:
 * cn('base-class', condition && 'conditional-class', 'possible-conflicting-class')
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}