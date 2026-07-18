// ESLint flat config for the frontend. Lints plain JS/JSX rules plus
// React Hooks correctness (e.g. exhaustive-deps) and Vite's react-refresh
// rule (warns if a file mixes component and non-component exports in a
// way that breaks hot reload). Run via `npm run lint`.
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Don't lint the production build output.
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Allow unused vars/imports whose name starts with an uppercase
      // letter or underscore (e.g. an unused component-style import kept
      // for a future branch) without failing the lint.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
