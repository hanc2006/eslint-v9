// import { rules, rr } from '../Rules';
// import { Severity, LinterOptionsConfig} from '@eslint/core'
// import { Linter}  from "eslint";


const ESLintPlugin: TSESLint.FlatConfig.Plugin {
//   rules: {
//     [key in keyof typeof rules]: (typeof rules)[key]['defaultOptions'];
//   };
//   configs?: Record<'racomandedd', any>;
// }


// // Export a type for the plugin's rules
// export type Rules = typeof plugin.rules;


// // const rules: TSESLint.SharedConfig.RulesRecord<>


// export const tseslintRules: Record<string, TSESLint.SharedConfig.RulesRecord<>> = {



// };

// export const t: ESLintPlugin = {
//   meta: {
//     name: '@yol-digital/node-linter-config',
//     version: '1.0.0'
//   },
//   rules: {
    
//       "avoid-class-method-t": {}
//   }
//   configs: {
//     recommended: {
//       plusgins: ['@microservice'],
//       rules: {
//       'avoid-class-method-throws': {}
        
//       } as rr
//     },
//   },
// };


import pkg from '../package.json' assert { type: 'json' };
import {
avoidClassMethodThrows,
enforceClassInheritance,
enforceClassMethodReturnType,
removePublicMethodReturnType,
replaceClassMethodErrorReturn,
replaceClassMethodSuccessReturn
} from '../Rules'
import { ESLintUtils, FlatConfig, TSESLint, InferOptionsTypeFromRule } from '@typescript-eslint/utils';


const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  rules: {
    'consistent-ref-type-annotation': consistentRefTypeAnnotation,
    'no-deprecated-classes': noDeprecatedClasses,
    'no-deprecated-components': noDeprecatedComponents,
    'no-deprecated-props': noDeprecatedProps,
    'no-legacy-library-import': noLegacyLibraryImport,
  },
} satisfies TSESLint.FlatConfig.Plugin;

export default plugin;