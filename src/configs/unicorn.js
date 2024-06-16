// @ts-check
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export const unicornConfig = [
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      'unicorn/error-message': 'error',
    },
  },
];
