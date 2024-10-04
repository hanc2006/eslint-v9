import { readFile, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';

type RuleType = 'eslint' | 'node';

interface Rule {
  name: string;
  options: any;
  configuration: any;
  description: string;
  documentation?: string;
}

interface RuleContent {
  ruleName: string;
  ruleDescription: string;
  ruleSummary: string;
  ruleDetails: string;
  incorrectExamples: string;
  correctExamples: string;
}

async function fetchDocumentation(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch documentation:', error);
    throw error;
  }
}

async function buildMarkdown(rule: Rule): Promise<string> {
  let markdown = '';

  if (rule.documentation) {
    try {
      const html = await fetchDocumentation(rule.documentation);
      const {
        ruleName,
        ruleDescription,
        ruleSummary,
        ruleDetails,
        incorrectExamples,
        correctExamples
      } = extractRuleInformation(html, rule.name);

      markdown = `### Rule: ${ruleName}\n`;
      markdown += `- **Options**: ${JSON.stringify(rule.options)}\n`;
      markdown += `- **Configuration**: ${JSON.stringify(rule.configuration)}\n`;
      markdown += `- **Description**: ${ruleDescription}\n`;
      markdown += `- **Summary**: ${ruleSummary}\n`;
      markdown += `- **Details**:\n\`\`\`javascript\n${ruleDetails}\n\`\`\`\n`;
      markdown += `- **Incorrect Examples**:\n\`\`\`javascript\n${incorrectExamples}\n\`\`\`\n`;
      markdown += `- **Correct Examples**:\n\`\`\`javascript\n${correctExamples}\n\`\`\`\n\n`;
    } catch (err) {
      console.error(`Failed to fetch documentation for ${rule.name}:`, err);
      markdown += `- **Documentation**: ${rule.name}\n`;
      markdown += `- **Example**: Not available\n\n`;
    }
  } else {
    markdown += `- **Documentation**: Not available\n\n`;
  }

  return markdown;
}

function extractRuleInformation(html: string, name: string): RuleContent {
  const $ = load(html);

  // let content: Cheerio<Element>;
  let ruleName = '';
  let ruleDescription = '';
  let ruleSummary = '';
  let ruleDetails = '';
  let incorrectExamples = '';
  let correctExamples = '';

  const ruleType = resolveRuleType(name);

  switch (ruleType) {
    case 'eslint':
      const content = $('.docs-main__content');
      ruleName = content.find('h1').text().trim();
      ruleDescription = content.find('p').first().text().trim();
      ruleSummary = content.find('p').eq(1).text().trim();
      ruleDetails = content.find('#rule-details').text().trim();
      incorrectExamples = content
        .find('.incorrect code')
        .map((_, el) => $(el).text().trim())
        .get()
        .join('\n\n');
      correctExamples = content
        .find('.correct code')
        .map((_, el) => $(el).text().trim())
        .get()
        .join('\n\n');
      break;
  }

  return {
    ruleName,
    ruleDescription,
    ruleSummary,
    ruleDetails,
    incorrectExamples,
    correctExamples
  };
}

function resolveRuleType(name: string): RuleType {
  switch (name) {
    case 'node/':
      return 'node';
    default:
      return 'eslint';
  }
}

export async function generateDocumentation() {
  try {
    const data = await readFile('eslint_report.json', 'utf8');
    const rules: Rule[] = JSON.parse(data).rules;
    let markdown = '# ESLint Rules Documentation\n\n## Active Rules\n\n';

    for (const rule of rules) {
      markdown += buildMarkdown(rule);
    }

    await writeFile('documentation.md', markdown);
    console.log('Documentation generated successfully!');
  } catch (err) {
    console.error(err);
  }
}
