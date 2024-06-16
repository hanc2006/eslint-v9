// @ts-check
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export const importConfig = [
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              // Node and React and related packages come first
              '^(react|node:)',
              '^@?\\w', // Internal packages.
              '^(@|components)(/.*|$)', // Side effect imports.
              '^\\u0000', // Parent imports. Put `..` last.
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$', // Other relative imports. Put same-folder imports and `.` last.
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$', // Style imports.
              '^.+\\.?(css)$',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
];
