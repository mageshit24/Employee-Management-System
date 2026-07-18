import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [react()],
    server: { port: 3000 },
    build: {
      // Code exposure prevention: source maps make a minified production
      // bundle trivially readable as original source + original file
      // layout in browser DevTools. Never ship them.
      sourcemap: false,
      // Belt-and-braces: strip any console/debugger statements that slip
      // into a production build, on top of the no-op logger used in code
      // (see src/utils/logger.js).
      minify: 'esbuild',
    },
    esbuild: isProd
      ? { drop: ['console', 'debugger'] }
      : {},
  }
})
