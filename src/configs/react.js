// @ts-check
import { fixupConfigRules } from '@eslint/compat';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactHooks from 'eslint-plugin-react-hooks';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export const reactConfig = [
  {
    files: ['**/*.jsx'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json'],
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    ...fixupConfigRules(pluginReactConfig),
    plugins: {
      // react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      'react/void-dom-elements-no-children': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
];
