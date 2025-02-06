import { digestDocument } from "./digest.js";
import { checkProof } from "./merkle.js";

export function verify(document) {
  if (document == null || document.signature == null) {
    return false;
  }

  const digest = digestDocument(document);
  const targetHash = document.signature.targetHash;
  if (digest !== targetHash) return false;

  return checkProof(
    document.signature.proof != null ? document.signature.proof : [],
    document.signature.merkleRoot,
    document.signature.targetHash,
  );
}
