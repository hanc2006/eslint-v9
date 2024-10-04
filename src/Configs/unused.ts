import { createConfig } from '../utils';
import pluginUnusedImport from 'eslint-plugin-unused-imports';

export const unusedImportConfig = createConfig({
  name: 'unused-imports',
  plugins: {
    'unused-imports': pluginUnusedImport
  },
  rules: {
    // handled by "@typescript-eslint/no-unused-vars": "off"
    'unused-imports/no-unused-vars': ['off'],
    'unused-imports/no-unused-imports': ['error']
  }
});
