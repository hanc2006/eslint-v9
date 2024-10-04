import * as rules from './rules';
import * as configs from './configs';

const packageData = require('../package.json') as Record<string, string>;
const meta = { name: packageData.name, version: packageData.version };

export { configs, meta, rules };


type RuleKey = keyof typeof rules;

interface Plugin extends Omit<ESLint.Plugin, 'rules'> {
    rules: Record<RuleKey, RuleModule<any, any, any>>;
  }

  const plugin: Plugin = {
    meta: {
      name: 'eslint-plugin-<my-plugin>', // or `@my-scope/eslint-plugin`
      version: '0.0.1',
    },
    rules
  };
  
  export default plugin;