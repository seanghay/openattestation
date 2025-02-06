import { v4 as uuidv4 } from "uuid";

const UUIDV4_LENGTH = 37;
const PRIMITIVE_TYPES = ["string", "number", "boolean", "undefined"];

export function deepMap(value, fn) {
  if (PRIMITIVE_TYPES.includes(typeof value) || value === null) {
    if (fn == null) return value;
    return fn(value);
  }

  if (Array.isArray(value)) {
    const collection = [];
    for (const item of value) {
      collection.push(deepMap(item, fn));
    }
    return collection;
  }

  if (typeof value === "object") {
    if ("toJSON" in value) {
      return value.toJSON();
    }

    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deepMap(v, fn)]),
    );
  }

  return value;
}

/**
 * @param {string} value
 * @returns {string}
 */
export function uuidSalt(value) {
  return `${uuidv4()}:${primitiveToTypedString(value)}`;
}

export function primitiveToTypedString(value) {
  if (value === null) return "null:null";
  const t = typeof value;
  switch (t) {
    case "number":
    case "string":
    case "boolean":
    case "undefined":
      return `${t}:${value}`;
    default:
      throw new Error(
        `Parsing error, value is not of primitive type: ${value}`,
      );
  }
}

/**
 * @param {string} input
 */
export function typedStringToPrimitive(input) {
  const end = input.indexOf(":");
  if (end === -1) return input;

  const type = input.slice(0, end);
  const value = input.slice(end + 1);

  switch (type) {
    case "number":
      return Number(value);
    case "string":
      return String(value);
    case "boolean":
      return value === "true";
    case "null":
      return null;
    case "undefined":
      return undefined;
    default:
      throw new Error(
        `Parsing error, type annotation not found in string: ${input}`,
      );
  }
}

/**
 * @param {string} value
 */
export function unsalt(value) {
  if (value.indexOf(":") === -1) return value;
  return typedStringToPrimitive(value.slice(UUIDV4_LENGTH));
}

export function saltData(data) {
  return deepMap(data, uuidSalt);
}

export function unsaltData(data) {
  return deepMap(data, unsalt);
}

export function getData(document) {
  return unsaltData(document.data);
}