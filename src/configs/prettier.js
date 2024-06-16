// @ts-check
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import config from '../../prettier.config.js';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export const prettierConfig = [
  eslintPluginPrettierRecommended,
  {
    rules: { 'prettier/prettier': ['error', config] },
  },
];
