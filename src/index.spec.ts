import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const eslint = new ESLint({ overrideConfigFile: './eslint.config.js' });

describe('eslint-config-xs', () => {
  it('.ts file', async () => {
    const [result] = await eslint.lintFiles('./src/__tests__/test.ts');

    const expected = [
      { ruleId: '@typescript-eslint/no-unused-vars', message: "'foo' is assigned a value but never used.", line: 4, column: 7 }, // prettier-ignore
      { ruleId: '@typescript-eslint/require-await', message: "Async arrow function 'fn' has no 'await' expression.", line: 6, column: 38 }, // prettier-ignore
      { ruleId: '@typescript-eslint/no-unsafe-call', message: 'Unsafe call of an `error` type typed value.', line: 8, column: 1 }, // prettier-ignore
      { ruleId: '@typescript-eslint/await-thenable', message: 'Unexpected `await` of a non-Promise (non-"Thenable") value.', line: 11, column: 7 }, // prettier-ignore
      { ruleId: 'eqeqeq', message: "Expected '===' and instead saw '=='.", line: 14, column: 19 }, // prettier-ignore
      { ruleId: 'unicorn/error-message', message: 'Pass a message to the `Error` constructor.', line: 16, column: 9 }, // prettier-ignore
    ];

    expect(result.messages).toHaveLength(expected.length);
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[0])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[1])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[2])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[3])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[4])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[5])]));
  });

  it.skip('.tsx file', async () => {
    const [result] = await eslint.lintFiles('./src/__tests__/test.tsx');

    const expected = [
      { ruleId: 'simple-import-sort/imports', message: 'Run autofix to sort these imports!', line: 1, column: 1}, // prettier-ignore
      { ruleId: 'prettier/prettier', message: 'Insert `;`', line: 8, column: 34}, // prettier-ignore
      { ruleId: 'prettier/prettier', message: 'Delete `··`', line: 16, column: 1}, // prettier-ignore
      { ruleId: 'no-constant-condition', message: 'Unexpected constant condition.', line: 10, column: 7}, // prettier-ignore
      { ruleId: 'tailwindcss/no-contradicting-classname', message: 'Classnames m-1, m-2 are conflicting!', line: 23, column: 14}, // prettier-ignore
    ];

    expect(result.messages).toHaveLength(expected.length);
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[0])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[1])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[2])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[3])]));
    expect(result.messages).toEqual(expect.arrayContaining([expect.objectContaining(expected[4])]));
  });
});
