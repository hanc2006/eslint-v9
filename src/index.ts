import gitignore from 'eslint-config-flat-gitignore';
import {
  eslintConfig,
  importConfig,
  nodeConfig,
  promiseConfig,
  typescriptConfig,
  unusedImportConfig,
  prettierConfig,
  microserviceConfig
} from './Configs';
import globals from 'globals';
import type { TSESLint } from '@typescript-eslint/utils';

export default [
  {
    name: 'files',
    files: [
      '__tests__/**/*.{js,mjs,cjs,ts}',
      'src/**/*.{js,mjs,cjs,ts}',
      'bin/**/*.{js,mjs,cjs,ts}'
    ]
  },
  gitignore(),
  // { ignores: ['prettier.config.js', 'eslint.config.js'] },
  {
    name: 'language',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals['shared-node-browser'],
        ...globals.node,
        ...globals.nodeBuiltin,
        ...globals.worker
      },
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false
      }
    }
  },
  microserviceConfig,
  importConfig,
  eslintConfig,
  nodeConfig,
  promiseConfig,
  unusedImportConfig,
  typescriptConfig,
  prettierConfig,
  {
    files: ["*.jsonc"],
    rules: {
      "jsonc/comma-dangle": "off",
      "jsonc/no-comments": "off",
      "jsonc/sort-keys": "error",
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
