import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Slug generation and conversion utilities for SEO-friendly URLs
export function createSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    console.warn('createSlug received invalid input:', text)
    return 'untitled'
  }
  
  const slug = text
    .toLowerCase()
    .replace(/[&\s]+/g, '-')           // Replace & and spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')       // Remove special characters
    .replace(/-+/g, '-')              // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '')          // Remove leading/trailing hyphens
  
  // If slug is empty after processing, provide a fallback
  if (!slug) {
    console.warn('createSlug resulted in empty slug for input:', text)
    return 'untitled'
  }
  
  return slug
}

export function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\bAnd\b/g, '&')         // Convert "And" back to "&"
}
