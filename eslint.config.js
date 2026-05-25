// eslint.config.js
import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // ─── Arquivos ignorados ────────────────────────────────────────────────────
  {
    ignores: ['dist/', 'build/', 'node_modules/', 'prisma/generated/', '**/*.d.ts'],
  },

  // ─── Base JS ───────────────────────────────────────────────────────────────
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // ─── TypeScript ────────────────────────────────────────────────────────────
  ...tseslint.configs.recommended,

  // ─── Regras customizadas para TS ──────────────────────────────────────────
  {
    files: ['**/*.ts'],
    rules: {
      // Evita any solto, mas avisa em vez de bloquear
      '@typescript-eslint/no-explicit-any': 'warn',

      // Variáveis não usadas — ignora params com prefixo _
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Força import type quando possível (melhor para tree-shaking)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Boas práticas gerais
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['error', 'warn', 'log'] }],
    },

    // Ignora arquivos de build e tipos gerados
    ignores: ['dist/', 'build/', 'node_modules/', 'prisma/generated/', '**/*.d.ts'],
  },

  // ─── Prettier — SEMPRE o último da cadeia ─────────────────────────────────
  prettierRecommended,
]);
