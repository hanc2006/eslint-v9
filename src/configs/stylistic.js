// @ts-check
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export const stylisticConfig = [
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
    },
  },
];
