import { type TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { createRule2, type CamelCase } from '../utils';
import { is } from '../guards';

const RULE_NAME = 'remove-public-method-return-type';

type MessageIds = CamelCase<typeof RULE_NAME>;

interface RemovePublicMethodReturnTypeOptions {
  baseClasses?: string[];
}

export const removePublicMethodReturnType = createRule2<
  RemovePublicMethodReturnTypeOptions,
  MessageIds
  // typeof RULE_NAME
>({
  name: 'remove-public-method-return-type',
  meta: {
    type: 'problem',
    docs: {
      description: 'Remove the defined return type of public method'
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
      removePublicMethodReturnType: 'Remove the defined return type of {{methodName}} public method'
    }
  },
  defaultOptions: [{ baseClasses: ['BaseService', 'BaseApi'] }],
  create(context, [options]) {
    const baseClasses = options?.baseClasses ?? ['BaseService', 'BaseApi'];

    return {
      MethodDefinition(node: TSESTree.MethodDefinition): void {
        // Check if the method is public and has a return type
        if (node.accessibility === 'public' && is.object(node.value.returnType)) {
          // Find the class declaration
          let currentNode: TSESTree.Node | undefined = node.parent;
          let classNode: TSESTree.ClassDeclaration | null = null;

          while (is.object(currentNode)) {
            if (currentNode.type === AST_NODE_TYPES.ClassDeclaration) {
              classNode = currentNode;
              break;
            }
            currentNode = currentNode.parent;
          }

          // Check if the class extends one of the base classes
          if (
            classNode?.superClass?.type === AST_NODE_TYPES.Identifier &&
            baseClasses.includes(classNode.superClass.name)
          ) {
            context.report({
              node: node.value.returnType,
              messageId: 'removePublicMethodReturnType',
              data: {
                methodName: node.key.type === AST_NODE_TYPES.Identifier ? node.key.name : 'unknown'
              },
              fix(fixer) {
                // Add a type guard to ensure returnType is defined
                if (is.object(node.value.returnType)) {
                  return fixer.removeRange([
                    node.value.returnType.range[0] - 1,
                    node.value.returnType.range[1]
                  ]);
                }
                return null; // Return null if we can't perform the fix
              }
            });
          }
        }
      }
    };
  }
});

// export default { [`microservice/${RULE_NAME}`]: removePublicMethodReturnType };
