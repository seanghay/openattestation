import sha3 from "js-sha3";
import { Buffer } from "node:buffer";

const { keccak256 } = sha3;

export function bufSortJoin(...args) {
  return Buffer.concat([...args].sort(Buffer.compare));
}

export function hashToBuffer(hash) {
  return Buffer.isBuffer(hash) && hash.length === 32
    ? hash
    : Buffer.from(hash, "hex");
}

export function toBuffer(element) {
  return Buffer.isBuffer(element) && element.length === 32
    ? element
    : hashToBuffer(keccak256(JSON.stringify(element)));
}

export function hashArray(arr) {
  return arr.map((i) => toBuffer(i)).sort(Buffer.compare);
}

export function combineHashBuffers(first, second) {
  if (!second) return first;
  if (!first) return second;
  return hashToBuffer(keccak256(bufSortJoin(first, second)));
}

function getNextLayer(elements) {
  return elements.reduce((layer, element, index, arr) => {
    if (index % 2 === 0) {
      // only calculate hash for even indexes
      layer.push(combineHashBuffers(element, arr[index + 1]));
    }
    return layer;
  }, []);
}

function getLayers(elements) {
  if (elements.length === 0) {
    return [[]];
  }
  const layers = [];
  layers.push(elements);
  while (layers[layers.length - 1].length > 1) {
    layers.push(getNextLayer(layers[layers.length - 1]));
  }
  return layers;
}

function getPair(index, layer) {
  const pairIndex = index % 2 ? index - 1 : index + 1;
  if (pairIndex < layer.length) return layer[pairIndex];
  return null;
}

function getProof(index, layers) {
  let i = index;
  const proof = layers.reduce((current, layer) => {
    const pair = getPair(i, layer);
    if (pair) {
      current.push(pair);
    }
    i = Math.floor(i / 2); // finds the index of the parent of the current node
    return current;
  }, []);
  return proof;
}

export class MerkleTree {
  constructor(_elements) {
    this.elements = hashArray(_elements);
    if (this.elements.some((e) => !(e.length === 32 && Buffer.isBuffer(e)))) {
      throw new Error("elements must be 32 byte buffers");
    }
    this.layers = getLayers(this.elements);
  }

  getRoot() {
    return this.layers[this.layers.length - 1][0];
  }

  getProof(_element) {
    const element = toBuffer(_element);
    const index = this.elements.findIndex((e) => e.equals(element));
    if (index === -1) throw new Error("Element not found");
    return getProof(index, this.layers);
  }
}

export function checkProof(_proof, _root, _element) {
  const proof = _proof.map((step) => hashToBuffer(step));
  const root = hashToBuffer(_root);
  const element = hashToBuffer(_element);
  const proofRoot = proof.reduce(
    (hash, pair) => combineHashBuffers(hash, pair),
    element,
  );
  return root.equals(proofRoot);
}
