import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { createRule2, type CamelCase } from '../utils';
import { is } from '../guards';

const RULE_NAME = 'avoid-class-method-throws';

type MessageIds = CamelCase<typeof RULE_NAME>;

interface AvoidClassMethodThrowsOptions {
  baseClasses?: string[];
}

export const avoidClassMethodThrows = createRule2<
  MessageIds,
  AvoidClassMethodThrowsOptions,
  // typeof RULE_NAME
>({
  name: 'avoid-class-method-throws'
  meta: {
    type: 'problem',
    docs: {
      description: 'Avoid throw statements in public method'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          baseClasses: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      avoidClassMethodThrows: 'Public methods must not throw errors directly'
    }
  },
  defaultOptions: [{ baseClasses: ['BaseService', 'BaseApi'] }],
  create(context, [options]) {
    const baseClasses = options?.baseClasses ?? this.defaultOptions;
    const sourceCode = context.sourceCode;

    function removeThrowStatement(fixer: RuleFixer, node: TSESTree.ThrowStatement) {
      const throwKeyword = sourceCode.getFirstToken(node);
      const semicolon = sourceCode.getLastToken(node);
      if (is.null(throwKeyword) || is.null(semicolon)) {
        return null;
      }
      const rangeToRemove: [number, number] = [
        throwKeyword.range[0],
        semicolon.value === ';' ? semicolon.range[1] : node.range[1]
      ];
      return fixer.removeRange(rangeToRemove);
    }

    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        if (
          node.superClass?.type === AST_NODE_TYPES.Identifier &&
          baseClasses.includes(node.superClass.name)
        ) {
          node.body.body.forEach((member) => {
            if (
              member.type === AST_NODE_TYPES.MethodDefinition &&
              member.accessibility === 'public'
            ) {
              const body = member.value.body;
              if (body?.type === AST_NODE_TYPES.BlockStatement) {
                body.body.forEach((statement) => {
                  if (statement.type === AST_NODE_TYPES.ThrowStatement) {
                    context.report({
                      node: statement,
                      messageId: 'avoidClassMethodThrows',
                      fix(fixer) {
                        return removeThrowStatement(fixer, statement);
                      }
                    });
                  }
                });
              }
            }
          });
        }
      }
    };
  }
});
