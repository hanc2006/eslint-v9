import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { RuleContext, RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { createRule2, type CamelCase } from '../utils';
import { is } from '../guards';

const RULE_NAME = 'replace-class-method-success-return';

type MessageIds = CamelCase<typeof RULE_NAME>;

interface ReplaceClassMethodSuccessReturnOptions {
  baseClasses?: string[];
}

export const replaceClassMethodSuccessReturn = createRule2<
  ReplaceClassMethodSuccessReturnOptions,
  MessageIds
  // typeof RULE_NAME
>({
  name: 'replace-class-method-success-return',
  meta: {
    type: 'problem',
    docs: {
      description: 'Transform success returns to use Ok() wrapper'
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
      replaceClassMethodSuccessReturn: 'Success return should use Ok() wrapper'
    }
  },
  defaultOptions: [{ baseClasses: ['BaseService', 'BaseApi'] }],
  create(context, [options]) {
    const sourceCode = context.sourceCode;
    const baseClasses = options.baseClasses ?? ['BaseService', 'BaseApi'];

    function checkStatement(
      statement: TSESTree.Statement,
      context: Readonly<RuleContext<MessageIds, [ReplaceClassMethodSuccessReturnOptions]>>
    ): void {
      if (statement.type === AST_NODE_TYPES.ReturnStatement && is.object(statement.argument)) {
        let fixText: string | null = null;

        if (
          statement.argument.type === AST_NODE_TYPES.CallExpression &&
          statement.argument.callee.type === AST_NODE_TYPES.MemberExpression &&
          statement.argument.callee.object.type === AST_NODE_TYPES.ThisExpression &&
          statement.argument.callee.property.type === AST_NODE_TYPES.Identifier &&
          statement.argument.callee.property.name === 'prepareSuccess'
        ) {
          // Case: this.prepareSuccess() is used
          const arg = statement.argument.arguments[0];
          fixText = is.string(arg) ? `return Ok(${sourceCode.getText(arg)});` : `return Ok();`;
        } else if (statement.argument.type === AST_NODE_TYPES.ObjectExpression) {
          // Case: Direct return of an object
          const dataProp = statement.argument.properties.find(
            (prop): prop is TSESTree.Property =>
              prop.type === AST_NODE_TYPES.Property &&
              prop.key.type === AST_NODE_TYPES.Identifier &&
              prop.key.name === 'data'
          );
          if (is.object(dataProp)) {
            fixText = `return Ok(${sourceCode.getText(dataProp.value)});`;
          } else {
            fixText = `return Ok(${sourceCode.getText(statement.argument)});`;
          }
        } else if (
          statement.argument.type !== AST_NODE_TYPES.CallExpression ||
          (statement.argument.callee.type === AST_NODE_TYPES.Identifier &&
            statement.argument.callee.name !== 'Ok' &&
            statement.argument.callee.name !== 'Err') ||
          (statement.argument.callee.type === AST_NODE_TYPES.MemberExpression &&
            statement.argument.callee.object.type === AST_NODE_TYPES.ThisExpression &&
            statement.argument.callee.property.type === AST_NODE_TYPES.Identifier &&
            statement.argument.callee.property.name !== 'prepareError')
        ) {
          // Case: Other types of returns that are not already wrapped with Ok() or Err() or this.prepareError()
          fixText = `return Ok(${sourceCode.getText(statement.argument)});`;
        }

        if (is.string(fixText)) {
          context.report({
            node: statement,
            messageId: 'replaceClassMethodSuccessReturn',
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

// export default { [`microservice/${RULE_NAME}`]: replaceClassMethodSuccessReturn };
