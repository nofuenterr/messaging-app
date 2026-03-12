import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Ignore build output and config files
  {
    ignores: ['node_modules', 'dist', 'build', 'client/dist', 'server/dist', '*.config.js'],
  },

  // Base JS + TS rules (all files)
  {
    files: ['**/*.{ts,tsx,js}'],
    extends: [js.configs.recommended],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.es2021,
    },
    plugins: { '@typescript-eslint': tsPlugin, import: importPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          pathGroupsExcludedImportTypes: ['@/**'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-as-default-member': 'error',
      'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never', js: 'never' }],
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.ts', '.tsx'], moduleDirectory: ['node_modules'] },
      },
    },
  },

  // React-specific rules (client only)
  {
    files: ['client/**/*.{ts,tsx}'],
    plugins: { react, '@typescript-eslint': tsPlugin, 'react-hooks': reactHooks },
    extends: [
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./client/tsconfig.app.json'], // point to client tsconfig
        warnOnMultipleTSConfigs: false,
      },
      globals: globals.browser,
    },
    settings: { react: { version: 'detect' } },
  },

  // Node-specific rules (server only)
  {
    files: ['server/**/*.ts'],
    rules: {
      'import/no-unresolved': 'off',
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./server/tsconfig.app.json'], // point to server tsconfig
        warnOnMultipleTSConfigs: false,
      },
      globals: globals.node,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'client/node_modules'],
        },
      },
    },
  },

  {
    files: ['client/vite.config.ts'],
    rules: {
      'import/no-unresolved': 'off', // safest option for config files
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./client/tsconfig.eslint.config.json'],
        warnOnMultipleTSConfigs: false,
      },
    },
  },
]);
