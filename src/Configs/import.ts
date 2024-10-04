import { createConfig } from '../utils';
import pluginImportX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';
import { tsExtenstions, jsExtenstions } from '../constants';

export const importConfig = createConfig({
  name: 'import-x',
  plugins: {
    'import-x': pluginImportX
  },
  languageOptions: {
    parser: tseslint.parser,
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  settings: {
    'import-x/extensions': [...tsExtenstions, ...jsExtenstions],
    'import-x/parsers': {
      '@typescript-eslint/parser': tsExtenstions
    },
    'import-x/resolver': {
      typescript: true
    }
  },
  rules: {
    'import-x/no-unresolved': 'off',
    'import-x/named': 'warn',
    'import-x/namespace': 'warn',
    'import-x/no-named-as-default': 'off',
    'import-x/export': 'warn',
    'import-x/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  }
});
