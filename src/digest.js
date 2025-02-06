import { flatten } from "flat";
import sha3 from "js-sha3";

const { keccak256 } = sha3;

export function flattenHashArray(data) {
  const flattenData = flatten(data, {
    transformKey(key) {
      if (key.indexOf(".") !== -1)
        throw new Error("Key names must not have . in them");
      return key;
    },
  });
  
  const items = [];
  for (const k in flattenData) {
    if (k === undefined) continue;
    const v = flattenData[k];
    if (v === undefined) continue;
    items.push(
      keccak256(
        JSON.stringify({
          [k]: v,
        }),
      ),
    );
  }

  return items;
}

export function digestDocument(document) {
  const hashedDataArray =
    "privacy" in document && "obfuscatedData" in document.privacy
      ? document.privacy.obfuscatedData
      : [];

  const unhashedData = document.data;
  const hashedUnhashedDataArray = flattenHashArray(unhashedData);
  const combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
  combinedHashes.sort();

  return keccak256(JSON.stringify(combinedHashes));
}
