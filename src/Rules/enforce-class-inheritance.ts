import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { createRule2, type CamelCase } from '../utils';
import { is } from '../guards';

const RULE_NAME = 'enforce-class-inheritance';

type MessageIds = CamelCase<typeof RULE_NAME>;

type EnforceClassInheritanceOptions = {
  folder: string;
  superclass: string;
};

export const enforceClassInheritance = createRule2<
  EnforceClassInheritanceOptions,
  MessageIds
  // typeof RULE_NAME
>({
  name: 'enforce-class-inheritance',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce class inheritance'
    },
    hasSuggestions: true,
    fixable: 'code',
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            folder: {
              type: 'string',
              description: 'The folder to check for class inheritance'
            },
            superclass: {
              type: 'string',
              description: 'The superclass that classes in the specified folder must extend'
            }
          },
          required: ['folder', 'superclass'],
          additionalProperties: false
        }
      }
    ],
    messages: {
      enforceClassInheritance: 'Classes in the "{{folder}}" folder must extend {{superclass}}'
    }
  },
  defaultOptions: [
    { folder: 'Domain/Services', superclass: 'BaseService' },
    { folder: 'Api/Http', superclass: 'BaseApi' }
  ],
  create(context, [options]) {
    const sourceCode = context.sourceCode;

    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const filePath = context.filename;

        options.forEach((option) => {
          const { folder, superclass } = option;

          if (filePath.endsWith(folder)) {
            if (
              node.superClass?.type === AST_NODE_TYPES.Identifier &&
              node.superClass.name !== superclass
            ) {
              context.report({
                node,
                messageId: 'enforceClassInheritance',
                data: { folder, superclass },
                fix(fixer: RuleFixer) {
                  const classToken = sourceCode.getFirstToken(node);

                  if (classToken === null) return null; // Unable to apply fix

                  const classNameToken = sourceCode.getTokenAfter(classToken);

                  if (classNameToken === null) return null; // Unable to apply fix

                  // Check if there's already an extends clause
                  if (is.object(node.superClass)) {
                    // Replace existing superclass
                    return fixer.replaceTextRange(
                      [node.superClass.range[0], node.superClass.range[1]],
                      `${superclass}<Settings>`
                    );
                  } else {
                    const openBraceToken = sourceCode.getTokenAfter(classNameToken);
                    if (is.object(openBraceToken)) {
                      // Add extends clause
                      return fixer.insertTextBefore(
                        openBraceToken,
                        ` extends ${superclass}<Settings>`
                      );
                    }
                    return null;
                  }
                }
              });
            }
          }
        });
      }
    };
  }
});
