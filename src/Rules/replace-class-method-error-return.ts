import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { createRule2, type CamelCase } from '../utils';
import type { RuleContext, RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { is } from '../guards';

const RULE_NAME = 'replace-class-method-error-return';

type MessageIds = CamelCase<typeof RULE_NAME>;

interface ReplaceClassMethodErrorReturnOptions {
  baseClasses?: string[];
}

export const replaceClassMethodErrorReturn = createRule2<
  ReplaceClassMethodErrorReturnOptions,
  MessageIds
  // typeof RULE_NAME
>({
  name: 'replace-class-method-error-return',
  meta: {
    type: 'problem',
    docs: {
      description: 'Transform error returns to use Err() wrapper'
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
            },
            default: ['BaseService', 'BaseApi']
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      replaceClassMethodErrorReturn: 'Error return should use Err() wrapper'
    }
  },
  defaultOptions: [{ baseClasses: ['BaseService', 'BaseApi'] }],
  create(context, [options]) {
    const sourceCode = context.sourceCode;
    const baseClasses = options.baseClasses ?? ['BaseService', 'BaseApi'];

    function extractErrorCode(node: TSESTree.ObjectExpression): string | null {
      if (is.object(node.properties)) {
        const errorProp = node.properties.find(
          (prop): prop is TSESTree.Property =>
            prop.type === AST_NODE_TYPES.Property &&
            prop.key.type === AST_NODE_TYPES.Identifier &&
            prop.key.name === 'error'
        );
        if (
          errorProp?.value.type === AST_NODE_TYPES.Literal &&
          typeof errorProp.value.value === 'string'
        ) {
          return sourceCode.getText(errorProp.value);
        }
      }
      return null;
    }

    function checkStatement(
      statement: TSESTree.Statement,
      context: RuleContext<MessageIds, [ReplaceClassMethodErrorReturnOptions]>
    ): void {
      if (statement.type === AST_NODE_TYPES.ReturnStatement && is.object(statement.argument)) {
        let fixText: string | null = null;

        if (
          statement.argument.type === AST_NODE_TYPES.CallExpression &&
          statement.argument.callee.type === AST_NODE_TYPES.MemberExpression &&
          statement.argument.callee.object.type === AST_NODE_TYPES.ThisExpression &&
          statement.argument.callee.property.type === AST_NODE_TYPES.Identifier &&
          statement.argument.callee.property.name === 'prepareError'
        ) {
          // Case: this.prepareError() is used
          const arg = statement.argument.arguments[0];
          if (is.object(arg)) {
            if (arg.type === AST_NODE_TYPES.ObjectExpression) {
              const errorCode = extractErrorCode(arg);
              fixText =
                is.string(errorCode) ?
                  `return Err(${errorCode});`
                : `return Err(${sourceCode.getText(arg)});`;
            } else {
              fixText = `return Err(${sourceCode.getText(arg)});`;
            }
          } else {
            fixText = `return Err();`;
          }
        } else if (statement.argument.type === AST_NODE_TYPES.ObjectExpression) {
          // Case: Direct return of an object with an error property containing a code
          const errorCode = extractErrorCode(statement.argument);
          if (is.string(errorCode)) {
            fixText = `return Err(${errorCode});`;
          }
        }

        if (is.string(fixText)) {
          context.report({
            node: statement,
            messageId: 'replaceClassMethodErrorReturn',
            fix(fixer: RuleFixer) {
              return fixer.replaceText(statement, fixText);
            }
          });
        }
      }

      // Recursively check nested statements
      switch (statement.type) {
        case AST_NODE_TYPES.BlockStatement:
          statement.body.forEach((nestedStatement) => {
            checkStatement(nestedStatement, context);
          });
          break;
        case AST_NODE_TYPES.IfStatement:
          checkStatement(statement.consequent, context);
          if (is.object(statement.alternate)) {
            checkStatement(statement.alternate, context);
          }
          break;
        case AST_NODE_TYPES.SwitchStatement:
          statement.cases.forEach((caseStatement) => {
            caseStatement.consequent.forEach((consequentStatement) => {
              checkStatement(consequentStatement, context);
            });
          });
          break;
        case AST_NODE_TYPES.TryStatement:
          checkStatement(statement.block, context);
          if (is.object(statement.handler)) {
            checkStatement(statement.handler.body, context);
          }
          if (is.object(statement.finalizer)) {
            checkStatement(statement.finalizer, context);
          }
          break;
      }
    }

    function checkMethodDefinition(node: TSESTree.MethodDefinition): void {
      if (
        node.value.body?.type === AST_NODE_TYPES.BlockStatement &&
        node.kind === 'method' &&
        node.accessibility === 'public'
      ) {
        node.value.body.body.forEach((statement) => {
          checkStatement(statement, context);
        });
      }
    }

    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        if (
          node.superClass?.type === AST_NODE_TYPES.Identifier &&
          baseClasses.includes(node.superClass.name)
        ) {
          node.body.body.forEach((member) => {
            if (member.type === AST_NODE_TYPES.MethodDefinition) {
              checkMethodDefinition(member);
            }
          });
        }
      }
    };
  }
});

// export default { [`microservice/${RULE_NAME}`]: replaceClassMethodErrorReturn };
