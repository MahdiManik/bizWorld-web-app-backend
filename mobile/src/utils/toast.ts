/**
 * Platform-specific toast implementation
 * This file serves as a barrel export that will resolve to the correct platform-specific implementation
 */

// The correct implementation will be chosen at build time by Metro/Webpack
export * from './toast.web';
export { default } from './toast.web';
