import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint';
import { createRule2, type CamelCase } from '../utils';
import { is } from '../guards';

const RULE_NAME = 'enforce-class-method-return-type';

type MessageIds = CamelCase<typeof RULE_NAME>;

interface EnforceClassMethodReturnTypeOptions {
  baseClasses?: string[];
}

export const enforceClassMethodReturnType = createRule2<
  EnforceClassMethodReturnTypeOptions,
  MessageIds
  // typeof RULE_NAME
>({
  name: 'enforce-class-method-return-type',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce class method return type to Ok() or Err()'
    },
    schema: [
      {
        type: 'object',
        properties: {
          baseClasses: {
            type: 'array',
            items: {
              type: 'string'
            },
            default: ['BaseService', 'BaseApi']
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      enforceClassMethodReturnType: 'Public methods must return using Ok() or Err() function'
    }
  },
  defaultOptions: [{ baseClasses: ['BaseService', 'BaseApi'] }],
  create(context, [options]) {
    const baseClasses = options.baseClasses ?? ['BaseService', 'BaseApi'];

    function checkReturnStatement(
      returnStatement: TSESTree.ReturnStatement,
      context: Parameters<
        (typeof enforceClassMethodReturnType)['enforce-class-method-return-type']['create']
      >['0']
    ): void {
      if (is.null(returnStatement.argument)) {
        context.report({
          node: returnStatement,
          messageId: 'enforceClassMethodReturnType'
        });
        return;
      }

      if (
        returnStatement.argument.type === AST_NODE_TYPES.CallExpression &&
        returnStatement.argument.callee.type === AST_NODE_TYPES.Identifier &&
        (returnStatement.argument.callee.name === 'Ok' ||
          returnStatement.argument.callee.name === 'Err')
      ) {
        // Using Ok() or Err(), this is correct
        return;
      }

      // For any other case, report an error
      context.report({
        node: returnStatement,
        messageId: 'enforceClassMethodReturnType'
      });
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
                  if (statement.type === AST_NODE_TYPES.ReturnStatement) {
                    checkReturnStatement(statement, context);
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
