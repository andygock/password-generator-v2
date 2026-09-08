import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Component tests use a DOM emulator, never a browser automation session.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{js,jsx}'],
    setupFiles: ['tests/setup.js'],
    restoreMocks: true,
  },
});
