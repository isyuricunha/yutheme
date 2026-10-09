import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Internal utilities shared by the components. Not exported from the package
 * entry points: consumers bring their own utilities.
 */

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export const range = (length: number): number[] => Array.from({ length }, (_, index) => index)
