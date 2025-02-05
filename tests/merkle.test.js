import test from "ava";
import sha3 from "js-sha3";

import {
  checkProof,
  MerkleTree,
  hashArray,
  hashToBuffer,
  toBuffer,
} from "../src/merkle.js";

const { keccak256 } = sha3;

const arr = ["item1", "item2", "item3", "item4", "item5"];
const bufferArr = hashArray(arr);
const tree = new MerkleTree(bufferArr);

test("creates a merkle tree", (t) => {
  t.not(tree.getRoot(), null);
  t.is(tree.layers.length, 4);
});

test("has a proof for an element", (t) => {
  const proof = tree.getProof(arr[0]);
  t.not(proof, null);
});

test("throws if item does not exist", (t) => {
  t.throws(() => tree.getProof("SOMETHING_ELSE"));
});

test("check if proof is valid for all items", (t) => {
  for (const i of arr) {
    const hash = keccak256(JSON.stringify(i));
    const proof = tree.getProof(i);
    const checkResults = checkProof(proof, tree.getRoot(), hash);
    t.true(checkResults);
  }
});

test("creates the tree properly if there is an even number of elements", (t) => {
  // this happens to create a merkle tree that requires no reordering
  const evenTree = new MerkleTree(["a", "b", "c", "d2"]);

  t.is(evenTree.layers[0].length, 4);
  t.is(evenTree.layers[1].length, 2);
  t.is(evenTree.layers[2].length, 1);

  const layer0 = evenTree.layers[0];
  const layer1 = evenTree.layers[1];
  const layer2 = evenTree.layers[2];

  t.deepEqual(
    hashToBuffer(keccak256(Buffer.concat([layer0[0], layer0[1]]))),
    layer1[0],
  );

  t.deepEqual(
    hashToBuffer(keccak256(Buffer.concat([layer0[2], layer0[3]]))),
    layer1[1],
  );

  t.deepEqual(
    hashToBuffer(keccak256(Buffer.concat([layer1[0], layer1[1]]))),
    layer2[0],
  );
});

test("creates the tree properly if there is an odd number of elements", (t) => {
  const oddTree = new MerkleTree(["a", "b", "c"]);
  const thirdElement = oddTree.elements[2];

  t.deepEqual(oddTree.layers[0][2], thirdElement);
  t.deepEqual(oddTree.layers[1][1], thirdElement); // checks that the lone element got promoted to next layer
});

test("calculates the hash correctly if the intermediate nodes are not lexicographically sorted", (t) => {
  const outOfOrderTree = new MerkleTree(["a", "b", "c", "d"]);
  // this happens to create a merkle tree with a second layer of
  // [ <Buffer 6d bf 31 7e 3f 6d 6a b9 ea d8 62 e7 f9 42 39 69 ab f2 76 c2 b4 a1 37 72 21 76 ba 85 dc 07 ed 3e>,
  //   <Buffer 6d 56 59 80 9f 50 5c 16 5b e5 83 58 79 73 1d e9 4c 1d 1a 1e 6a d4 02 25 51 d5 13 17 9b 4d 92 c6> ]
  // which is out of order and should be swapped before hashing

  const secondLayer = outOfOrderTree.layers[1];
  const hash = hashToBuffer(
    keccak256(Buffer.concat([secondLayer[1], secondLayer[0]])),
  );

  t.deepEqual(hash, outOfOrderTree.layers[2][0]);
});

test("checkProof returns true for valid proof", (t) => {
  const proof = tree.getProof(arr[1]);
  const checkResults = checkProof(proof, tree.getRoot(), toBuffer(arr[1]));
  t.true(checkResults);
});

test("checkProof returns false for invalid proof", (t) => {
  const proof = tree.getProof(arr[0]);
  const checkResults = checkProof(proof, tree.getRoot(), toBuffer(arr[1]));
  t.false(checkResults);
});
