import prettierRules from '../prettier.config';
import prettierConfig, { name } from 'eslint-plugin-prettier/recommended';

prettierConfig.rules = {
  ...prettierConfig.rules,
  ...{ 'prettier/prettier': ['error', prettierRules] }
};

prettierConfig.name = 'prettier';

export { prettierConfig };
