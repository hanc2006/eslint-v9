import type { Rules } from './Configs/rules';
import {
  RuleCreator,
  NamedCreateRuleMetaDocs,
  RuleCreateAndOptions,
  RuleWithMetaAndName,
  InferOptionsTypeFromRule
} from '@typescript-eslint/utils/eslint-utils';
import { FlatConfig, RuleCreator, RuleModule } from '@typescript-eslint/utils/ts-eslint';
import { rules } from 'Rules/index';
import { RuleModule, RuleContext, ESLintUtils } from '@typescript-eslint/utils';
export RuleCreator from '@typescript-eslint/utils/eslint-utils';


export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export type LiteralStringUnion<T> = LiteralUnion<T, string>;

type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & Record<never, never>);

export type PickRules<T extends PluginName> =
  T extends '' | 'eslint' ? Pick<Rules, Exclude<keyof Rules, `${string}/${string}`>>
  : {
    [K in keyof Rules as K extends `${T}/${string}` ? K : never]: Rules[K];
  };

export type CamelCase<S extends string> =
  S extends `${infer P1}-${infer P2}${infer P3}` ?
  `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : S;

/**
 * Supported Plugins
 *
 * - 'n': Node.js plugin
 * - 'import-x': Import plugin
 * - 'promise': Promise plugin
 * - '@typescript-eslint': TypeScript ESLint plugin
 * - 'unused-imports': Unused imports plugin
 * - 'eslint': ESLint core rules
 * - 'microservice': ESLint custom rules for microservices
 */
export type PluginName =
  | 'n'
  | 'import-x'
  | 'promise'
  | '@typescript-eslint'
  | 'unused-imports'
  | 'eslint'
  | 'prettier'
  | 'microservice';

export type PluginConfig<T extends PluginName> = Omit<FlatConfig.Config, 'rules' | 'name'> & {
  rules: PickRules<T>;
  name: T;
};

export const createConfig = <T extends PluginName>(config: PluginConfig<T>): FlatConfig.Config => {
  return config: TSESLint.;
};

type RuleRecord<
  TMessages extends string | string[],
  TOptions extends unknown,
  TRuleName extends string
> = { [key in TRuleName]: RuleModule<TMessageIds, TOptions> };

export const createRule2 = RuleCreator(
  (name) => `https://my-website.io/eslint/${name}`
);

export function createRule<
  TMessages extends string | string[],
  TOptions extends unknown,
  TRuleName extends string
>(options: Omit<RuleWithMetaAndName<TOptions, TMessages>, 'name'> & { name: TRuleName }) {
  return {
    [options.name]: ESLintUtils.RuleCreator<TOptions, TMessageIds>({
      ...options,
      name: options.name
    })
  } as RuleRecord<TMessages, TOptions, TRuleName>;
}
// Utility type to extract the actual rule names
// type RuleNames = keyof typeof rules;

// // Prefix for the rules
// type Prefix = '@microservice/';

// // Utility type to prefix rule names

// export type TRules<P extends string = Prefix> = {
//   [K in RuleNames as `${P}${RuleNames}`]: (typeof rules)[K]['defaultOptions'] extends readonly [] ?
//     [severity: 'off' | 'warn' | 'error']
//   : [severity: 'off' | 'warn' | 'error', options: (typeof rules)[K]['defaultOptions']];
// };

// Custom config type
export type CustomConfig<P extends string = Prefix> = Omit<TSESLint.Linter.Config, 'rules'> & {
  rules?: Partial<TRules<P>>;
};

// Function to create custom config
export function createCustomConfig<P extends string = Prefix>(
  config: CustomConfig<P>
): TSESLint.Linter.Config {
  return config;
}

type RuleNames = keyof typeof rules;

type Prefix = '@microservice/';

type Severity = Linter.RuleSeverity;

export type TRules<P extends string = Prefix> = {
  [K in keyof typeof rules as `${P}${K}`]: Linter.RuleEntry<(typeof rules)[K]>;
};

// Custom config type
export type CustomConfig<P extends string = Prefix> = Omit<Linter.Config, 'rules'> & {
  rules?: TRules<P>;
};
