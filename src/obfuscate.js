import { flatten } from "flat";
import { toBuffer } from "./merkle.js";
import pick from "pick-deep";
import unset from "lodash.unset";
import cloneDeep from "lodash.clonedeep";

export function obfuscateData(_data, _fields) {
  const data = cloneDeep(_data);
  let fields = _fields;

  if (typeof fields === "string") {
    fields = [fields];
  }

  const dataToObfuscate = flatten(pick(data, fields));
  const obfuscatedData = [];

  for (const [k, v] of Object.entries(dataToObfuscate)) {
    obfuscatedData.push(
      toBuffer({
        [k]: v,
      }).toString("hex"),
    );
  }

  for (const f of fields) {
    unset(data, f);
  }

  return {
    data,
    obfuscatedData,
  };
}

export function obfuscateDocument(document, fields) {
  const existingData = document.data;
  const { data, obfuscatedData } = obfuscateData(existingData, fields);
  const currentObfuscatedData =
    "privacy" in document && "obfuscatedData" in document.privacy
      ? document.privacy.obfuscatedData
      : [];

  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);

  return {
    ...document,
    data,
    privacy: {
      ...document.privacy,
      obfuscatedData: newObfuscatedData,
    },
  };
}

export function getObfuscatedData(document) {
  if (document == null) return [];
  if (document.privacy == null) return [];
  if (document.privacy.obfuscatedData == null) return [];
  return document.privacy.obfuscatedData;
}
