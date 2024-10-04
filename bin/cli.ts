#!/usr/bin/env -S pnpm tsx

import inquirer from 'inquirer';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { generateDocumentation } from './docgen';
import { generateTypedRules } from './typegen';

const execAsync = promisify(exec);

async function runConfigInspector() {
  try {
    await execAsync('npx eslint-config-inspector --output eslint_rules_report.json');
    console.log('ESLint report generated successfully!');
  } catch (err) {
    console.error('Failed to generate ESLint report', err);
  }
}

async function main() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { name: 'Build ESLint rules documentation', value: 'doc' },
        { name: 'Build ESLint rules type definition', value: 'type' },
        { name: 'Quit', value: 'quit' }
      ]
    }
  ]);

  if (answers.action === 'doc') {
    await runConfigInspector();
    await generateDocumentation();
  } else if (answers.action === 'type') {
    await generateTypedRules();
  } else {
    console.log('Quitting application.');
    process.exit();
  }
}

main();
