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
      // Vite 8 replaced the old esbuild-based build pipeline with
      // Rolldown (Rust bundler) + Oxc (transform/minify) - 'oxc' is
      // actually the default already, set explicitly so it's obvious
      // what's minifying this bundle.
      minify: 'oxc',
      // Belt-and-braces: strip console/debugger statements from the
      // production bundle, on top of the no-op logger used in code (see
      // src/utils/logger.js). This replaces the old top-level
      // `esbuild: { drop: [...] }` option, which Vite 8 removed along
      // with its esbuild-based transform pipeline - the equivalent knobs
      // now live under rolldownOptions.output.minify.compress. Oxc's
      // compress step already drops `debugger` statements by default;
      // dropConsole is spelled out here because its default is false.
      rolldownOptions: isProd
        ? {
          output: {
            minify: {
              compress: { dropConsole: true, dropDebugger: true },
            },
          },
        }
        : {},
    },
  }
})
