/* eslint-disable @typescript-eslint/no-explicit-any */

type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;

export type Primitive = string | number | bigint | boolean | symbol | null | undefined;

export type Falsy = false | 0 | 0n | '' | null | undefined;

export type Class<T, Arguments extends unknown[] = any[]> = Constructor<T, Arguments> & {
  prototype: T;
};

export type NonEmptyString = string & { 0: string };

type ExtractFromGlobalConstructors<Name extends string> =
  Name extends string ?
    typeof globalThis extends Record<Name, new (...arguments_: any[]) => infer T> ?
      T
    : never
  : never;

type NodeBuffer = ExtractFromGlobalConstructors<'Buffer'>;

type Predicate = (value: unknown) => boolean;

export function isAll(predicate: Predicate, ...values: unknown[]): boolean {
  return predicateOnArray(Array.prototype.every, predicate, values);
}

export function isTruthy<T>(value: T | Falsy): value is T {
  return Boolean(value);
}

export function isSome(predicate: Predicate, ...values: unknown[]): boolean {
  return predicateOnArray(Array.prototype.some, predicate, values);
}

export function isAny(predicate: Predicate | Predicate[], ...values: unknown[]): boolean {
  const predicates = Array.isArray(predicate) ? predicate : [predicate];
  return predicates.some((singlePredicate) =>
    predicateOnArray(Array.prototype.some, singlePredicate, values)
  );
}

export function isArray<T = unknown>(
  value: unknown,
  assertion?: (value: T) => value is T
): value is T[] {
  if (!Array.isArray(value)) {
    return false;
  }

  if (typeof assertion !== 'function') {
    return true;
  }

  return value.every((element) => assertion(element as T));
}

export function isBlob(value: unknown): value is Blob {
  return getObjectType(value) === 'Blob';
}

export function isBoolean(value: unknown): value is boolean {
  return value === true || value === false;
}

export function isBuffer(value: unknown): value is NodeBuffer {
  return (value as any)?.constructor?.isBuffer?.(value) ?? false;
}

export function isClass<T = unknown>(value: unknown): value is Class<T> {
  return typeof value === 'function' && value.toString().startsWith('class ');
}

export function isDate(value: unknown): value is Date {
  return getObjectType(value) === 'Date';
}

export function isEmptyArray(value: unknown): value is never[] {
  return Array.isArray(value) && value.length === 0;
}

export function isEmptyObject<Key extends keyof any = string>(
  value: unknown
): value is Record<Key, never> {
  return isObject(value) && !isMap(value) && !isSet(value) && Object.keys(value).length === 0;
}

export function isEmptyString(value: unknown): value is '' {
  return typeof value === 'string' && value.length === 0;
}

export function isEnumValue<T extends Record<string, string | number>>(
  value: unknown,
  enumObj: T
): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}

export function isError(value: unknown): value is Error {
  return getObjectType(value) === 'Error';
}

export function isFalsy(value: unknown): value is Falsy {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return !value;
}

export function isInRange(value: number, range: [number, number]): boolean {
  const [min, max] = range.sort((a, b) => a - b);
  return value >= min && value <= max;
}

export function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

export function isNan(value: unknown) {
  return Number.isNaN(value);
}

export function isNonEmptyArray<T = unknown, Item = unknown>(
  value: T | Item[]
): value is [Item, ...Item[]] {
  return Array.isArray(value) && value.length > 0;
}

export function isNonEmptyObject<Key extends keyof any = string, Value = unknown>(
  value: unknown
): value is Record<Key, Value> {
  return isObject(value) && !isMap(value) && !isSet(value) && Object.keys(value).length > 0;
}

export function isNonEmptyString(value: unknown): value is NonEmptyString {
  return typeof value === 'string' && value.length > 0;
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isObject(value: unknown): value is object {
  return value !== null && (typeof value === 'object' || typeof value === 'function');
}

export function isPlainObject<Value = unknown>(
  value: unknown
): value is Record<PropertyKey, Value> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in value) &&
    !(Symbol.iterator in value)
  );
}

export function isPrimitive(value: unknown): value is Primitive {
  return isNull(value) || isPrimitiveTypeName(typeof value);
}

export function isRegExp(value: unknown): value is RegExp {
  return getObjectType(value) === 'RegExp';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

function predicateOnArray(method: ArrayMethod, predicate: Predicate, values: unknown[]) {
  if (typeof predicate !== 'function') {
    throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
  }

  if (values.length === 0) {
    throw new TypeError('Invalid number of values');
  }

  return method.call(values, predicate);
}

type ArrayMethod = (
  function_: (value: unknown, index: number, array: unknown[]) => boolean,
  thisArgument?: unknown
) => boolean;

function getObjectType(value: unknown): string | undefined {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  return isObjectTypeName(objectTypeName) ? objectTypeName : undefined;
}

function isObjectTypeName(name: unknown): name is ObjectTypeName {
  return objectTypeNames.includes(name as ObjectTypeName);
}

const objectTypeNames = [
  'Function',
  'Generator',
  'AsyncGenerator',
  'GeneratorFunction',
  'AsyncGeneratorFunction',
  'AsyncFunction',
  'Observable',
  'Array',
  'Buffer',
  'Object',
  'RegExp',
  'Date',
  'Error',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'ArrayBuffer',
  'SharedArrayBuffer',
  'DataView',
  'Promise',
  'URL',
  'HTMLElement',
  'NaN',
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array'
] as const;

type ObjectTypeName = (typeof objectTypeNames)[number];

const primitiveTypeNames = [
  'null',
  'undefined',
  'string',
  'number',
  'bigint',
  'boolean',
  'symbol'
] as const;

type PrimitiveTypeName = (typeof primitiveTypeNames)[number];

function isPrimitiveTypeName(name: unknown): name is PrimitiveTypeName {
  return primitiveTypeNames.includes(name as PrimitiveTypeName);
}

function isMap<Key = unknown, Value = unknown>(value: unknown): value is Map<Key, Value> {
  return getObjectType(value) === 'Map';
}

function isSet<T = unknown>(value: unknown): value is Set<T> {
  return getObjectType(value) === 'Set';
}

export const is = {
  all: isAll,
  any: isAny,
  some: isSome,
  array: isArray,
  blob: isBlob,
  boolean: isBoolean,
  buffer: isBuffer,
  class: isClass,
  date: isDate,
  emptyArray: isEmptyArray,
  emptyObject: isEmptyObject,
  emptyString: isEmptyString,
  error: isError,
  falsy: isFalsy,
  inRange: isInRange,
  integer: isInteger,
  nan: isNan,
  nonEmptyArray: isNonEmptyArray,
  nonEmptyObject: isNonEmptyObject,
  nonEmptyString: isNonEmptyString,
  null: isNull,
  nullOrUndefined: isNullOrUndefined,
  number: isNumber,
  object: isObject,
  plainObject: isPlainObject,
  primitive: isPrimitive,
  regExp: isRegExp,
  string: isString,
  truthy: isTruthy,
  undefined: isUndefined
};
