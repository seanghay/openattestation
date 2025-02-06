import { digestDocument } from "./digest.js";
import { hashToBuffer, MerkleTree } from "./merkle.js";
import { saltData } from "./salt.js";
import { SchemaId } from "./schema.js";

function createDocument(data, option) {
  const documentSchema = {
    version: SchemaId.v2,
    data: saltData(data),
  };

  if (option?.externalSchemaId) {
    documentSchema.schema = option.externalSchemaId;
  }

  return documentSchema;
}

export function wrapDocument(data, options) {
  const document = createDocument(data, options);
  // TODO: Add schema validation?
  const digest = digestDocument(document);
  const signature = {
    type: "SHA3MerkleProof",
    targetHash: digest,
    proof: [],
    merkleRoot: digest,
  };
  return { ...document, signature };
}

export function wrapDocuments(data, options) {
  const documents = [];
  const documentBuffers = [];

  for (const d of data) {
    const wd = wrapDocument(d, options);
    documents.push(wd);
    documentBuffers.push(hashToBuffer(wd.signature.targetHash));
  }

  const merkleTree = new MerkleTree(documentBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");

  const items = [];

  let i = 0;
  for (const document of documents) {
    const proof = [];

    for (const buffer of merkleTree.getProof(documentBuffers[i])) {
      proof.push(buffer.toString("hex"));
    }

    items.push({
      ...document,
      signature: {
        ...document.signature,
        proof,
        merkleRoot,
      },
    });
    i++;
  }

  return items;
}
