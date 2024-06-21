import eslint from '@eslint/js';
import globals from 'globals';
import tslint from 'typescript-eslint';
import { importConfig } from './src/configs/import.js';
import { prettierConfig } from './src/configs/prettier.js';
import { reactConfig } from './src/configs/react.js';
import { stylisticConfig } from './src/configs/stylistic.js';
import { tailwindConfig } from './src/configs/tailwind.js';
import { unicornConfig } from './src/configs/unicorn.js';

export default tslint.config(
  eslint.configs.recommended,
  // ...tslint.configs.recommended,
  ...tslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.nodeBuiltin,
        ...globals.worker,
      },
    },
  },
  ...(await reactConfig),
  ...(await prettierConfig),
  ...(await unicornConfig),
  ...(await importConfig),
  ...(await stylisticConfig),
  ...(await tailwindConfig),
  {
    rules: {
      eqeqeq: 'error',
      // '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/ban-types': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' }],
    },
  },
);
