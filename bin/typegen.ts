import pluginTypescript from '@typescript-eslint/eslint-plugin';
import type { ESLint } from 'eslint';
import pluginImport from 'eslint-plugin-import-x';
import pluginNode from 'eslint-plugin-n';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

function wrapPlugin(plugin: any): ESLint.Plugin {
  return {
    rules: plugin.rules ?? {},
    configs: plugin.configs ?? {}
  };
}

export async function generateTypedRules(): Promise<void> {
  const dts = await flatConfigsToRulesDTS(
    [
      {
        // ESLint built-in rules
        plugins: { '': { rules: Object.fromEntries(builtinRules.entries()) } }
      },
      {
        // Custom rules
        plugins: {
          'import-x': wrapPlugin(pluginImport),
          'unused-imports': pluginUnusedImports,
          n: wrapPlugin(pluginNode),
          '@typescript-eslint': wrapPlugin(pluginTypescript),
          promise: wrapPlugin(pluginPromise),
          prettier: wrapPlugin(pluginPrettier)
        }
      }
    ],
    { includeAugmentation: false, exportTypeName: 'Rules' }
  );

  dts += `
    // Names of all the configs
    export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
  `;

  const destPath = join(__dirname, '../src/Config/rules2.d.ts');

  await writeFile(destPath, dts);
}
