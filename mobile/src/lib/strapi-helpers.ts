/**
 * Helper utilities for working with Strapi API responses
 */
import Constants from 'expo-constants'

/**
 * Unwraps a Strapi entity response by flattening the id and attributes
 * into a single object for easier consumption in the frontend
 * 
 * @param response Strapi entity with id and attributes
 * @returns Flattened entity with id and all attribute fields, or null if input is nullish
 */
export function unwrap<T>(response: { id: number; attributes: T } | null | undefined): (T & { id: number }) | null {
  if (!response) return null;
  return { id: response.id, ...response.attributes };
}

/**
 * Unwraps an array of Strapi entity responses
 * 
 * @param responses Array of Strapi entities with id and attributes
 * @returns Array of flattened entities
 */
export function unwrapArray<T>(responses: Array<{ id: number; attributes: T }> | null | undefined): Array<T & { id: number }> {
  if (!responses || !Array.isArray(responses)) return [];
  return responses.map(item => unwrap(item)).filter((item): item is T & { id: number } => item !== null);
}

/**
 * Unwraps the first item of a Strapi collection response or returns null
 * 
 * @param responses Array of Strapi entities
 * @returns First entity flattened or null if empty
 */
export function unwrapFirst<T>(responses: Array<{ id: number; attributes: T }> | null | undefined): (T & { id: number }) | null {
  if (!responses || !Array.isArray(responses) || responses.length === 0) return null;
  return unwrap(responses[0]);
}

/**
 * Gets the full URL for a Strapi media item
 * 
 * @param url Relative or full URL of the media
 * @returns Full URL to the media with proper backend address
 */
export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return 'https://placehold.co/400x400?text=No+Image';
  
  // If the URL starts with a slash, it's a relative URL
  // so we need to prepend the backend URL
  if (url.startsWith('/')) {
    const backendUrl = Constants?.manifest?.extra?.backendUrl || 'http://localhost:1337';
    return `${backendUrl}${url}`;
  }
  
  // Otherwise, it's already a full URL
  return url;
}
