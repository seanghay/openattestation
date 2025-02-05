import test from "ava";

import {
  deepMap,
  primitiveToTypedString,
  saltData,
  typedStringToPrimitive,
  unsalt,
  unsaltData,
  uuidSalt,
} from "../src/salt.js";

const someObj = {
  keyA: "value 1",
  keyB: {
    nestedKeyA: "nested value 1",
    nestedKeyBwithArray: [
      {
        arrayObject1KeyA: "array object value 1",
        arrayObject1KeyB: 3,
        arrayObject1KeyC: false,
        arrayObject1KeyD: "0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce",
        arrayObject1KeyE: "3.14159",
        arrayObject1KeyF: "true",
        arrayObject1KeyG: "false",
        arrayObject1KeyH: "undefined",
        arrayObject1KeyI: "null",
        arrayObject1KeyJ: undefined,
        arrayObject1KeyK: null,
      },
      {
        arrayObject2KeyA: {
          arrayObject2NestedObjectA: "array object nested object value 1",
          arrayObject2NestedObjectB: 5,
          arrayObject2NestedObjectC: true,
        },
      },
    ],
    nestedKeyC: {
      doubleNestedKeyA: "value 5",
    },
  },
  keyWithNumberArray: [123, 321],
  keyWithStringArray: ["foo", "bar"],
};

test("salts and add type to primitives", (t) => {
  const saltedString = uuidSalt("test string");

  const uuidRegex =
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/;

  t.is(saltedString.length, 55);
  t.is(saltedString.substring(36, 37), ":");
  t.is(uuidRegex.test(saltedString.split(":")[0]), true);
  t.is(saltedString.substring(37), "string:test string");
});

const fakeSalt = (value) => `fakesalt: ${String(value)}`;

const fakeSaltedObject = {
  keyA: "fakesalt: value 1",
  keyB: {
    nestedKeyA: "fakesalt: nested value 1",
    nestedKeyBwithArray: [
      {
        arrayObject1KeyA: "fakesalt: array object value 1",
        arrayObject1KeyB: "fakesalt: 3",
        arrayObject1KeyC: "fakesalt: false",
        arrayObject1KeyD:
          "fakesalt: 0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce",
        arrayObject1KeyE: "fakesalt: 3.14159",
        arrayObject1KeyF: "fakesalt: true",
        arrayObject1KeyG: "fakesalt: false",
        arrayObject1KeyH: "fakesalt: undefined",
        arrayObject1KeyI: "fakesalt: null",
        arrayObject1KeyJ: "fakesalt: undefined",
        arrayObject1KeyK: "fakesalt: null",
      },
      {
        arrayObject2KeyA: {
          arrayObject2NestedObjectA:
            "fakesalt: array object nested object value 1",
          arrayObject2NestedObjectB: "fakesalt: 5",
          arrayObject2NestedObjectC: "fakesalt: true",
        },
      },
    ],
    nestedKeyC: { doubleNestedKeyA: "fakesalt: value 5" },
  },
  keyWithNumberArray: ["fakesalt: 123", "fakesalt: 321"],
  keyWithStringArray: ["fakesalt: foo", "fakesalt: bar"],
};

test("traverses copys if no function is supplied", (t) => {
  t.deepEqual(deepMap(someObj), someObj);
});

test("should apply function recursively", (t) => {
  t.deepEqual(deepMap(someObj, fakeSalt), fakeSaltedObject);
});

test("should unsalt numbers", (t) => {
  t.is(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5"), 5);
  t.is(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:51234"), 51234);
  t.is(
    unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:51234.54321"),
    51234.54321,
  );
});

test("should unsalt booleans", (t) => {
  t.is(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:boolean:true"), true);
  t.is(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:boolean:false"), false);
});

test("should unsalt strings", (t) => {
  t.is(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:string:abcd"), "abcd");
});

test("should unsalt numbers in string format", (t) => {
  t.is(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:string:1234"), "1234");
});

test("works for number", (t) => {
  t.is(primitiveToTypedString(12), "number:12");
  // biome-ignore lint/suspicious/noApproximativeNumericConstant: Not PI
  t.is(primitiveToTypedString(3.14159), "number:3.14159");
});

test("works for string", (t) => {
  t.is(primitiveToTypedString("test"), "string:test");
  t.is(primitiveToTypedString("true"), "string:true");
  t.is(primitiveToTypedString("1"), "string:1");
  t.is(primitiveToTypedString("3.14159"), "string:3.14159");
});

test("works for boolean", (t) => {
  t.is(primitiveToTypedString(true), "boolean:true");
  t.is(primitiveToTypedString(false), "boolean:false");
});

test("works for null", (t) => {
  t.is(primitiveToTypedString(null), "null:null");
});

test("works for undefined", (t) => {
  t.is(primitiveToTypedString(undefined), "undefined:undefined");
});

test("typedStringToPrimitive: works for number", (t) => {
  t.is(typedStringToPrimitive("number:12"), 12);
  // biome-ignore lint/suspicious/noApproximativeNumericConstant: Not PI
  t.is(typedStringToPrimitive("number:3.14159"), 3.14159);
});

test("typedStringToPrimitive: works for string", (t) => {
  t.is(typedStringToPrimitive("string:test"), "test");
  t.is(typedStringToPrimitive("string:true"), "true");
  t.is(typedStringToPrimitive("string:1"), "1");
  t.is(typedStringToPrimitive("string:3.14159"), "3.14159");
});

test("typedStringToPrimitive: works for boolean", (t) => {
  t.is(typedStringToPrimitive("boolean:true"), true);
  t.is(typedStringToPrimitive("boolean:false"), false);
});

test("typedStringToPrimitive: works for null", (t) => {
  t.is(typedStringToPrimitive("null:null"), null);
});

test("typedStringToPrimitive: works for undefined", (t) => {
  t.is(typedStringToPrimitive("undefined:undefined"), undefined);
});

test("works for all types of values", (t) => {
  const salted = saltData(someObj);
  const unsalted = unsaltData(salted);
  t.deepEqual(unsalted, someObj);
});
