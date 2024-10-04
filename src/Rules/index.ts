// import { RuleModule } from '@typescript-eslint/utils/ts-eslint';

export { avoidClassMethodThrows } from './avoid-class-method-throws';
export { enforceClassInheritance } from './enforce-class-inheritance';
export { enforceClassMethodReturnType } from './enforce-class-method-return-type';
export { removePublicMethodReturnType } from './remove-public-method-return-type';
export { replaceClassMethodErrorReturn } from './replace-class-method-error-return';
export { replaceClassMethodSuccessReturn } from './replace-class-method-success-return';

// export const rules = {
//   ...avoidClassMethodThrows,
//   ...enforceClassInheritance,
//   ...enforceClassMethodReturnType,
//   ...removePublicMethodReturnType,
//   ...replaceClassMethodErrorReturn,
//   ...replaceClassMethodSuccessReturn
// };

// Utility type to extract the actual rule names
type RuleNames = keyof (typeof rules.create)['name'];

// Utility type to prefix rule names
const rules: {
  [key in keyof typeof rules]: (typeof rules)[key]['defaultOptions'];
};

rules['avoid-class-method-throws'].defaultOptions;
