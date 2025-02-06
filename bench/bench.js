import {
  wrapDocument as wrapDocument_oa,
  getData as getData_oa,
  obfuscateDocument as obfuscateDocument_oa,
  verify as verify_oa,
} from "openattestation";

import {
  wrapDocument,
  getData,
  obfuscateDocument,
  verifySignature,
} from "@govtechsg/open-attestation";

import benchmark from "benchmark";

const wd = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    billFrom: {},
    billTo: { company: {} },
    $template: {
      type: "f76f4d39-8d23-455b-96ba-5889e0233641:string:EMBEDDED_RENDERER",
      name: "575f0624-7f43-484c-9285-edd1ae96ebc6:string:INVOICE",
      url: "fb61f072-64e9-4c2f-83bf-ae68fd911414:string:https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "ed121e9e-8f70-4a01-a422-4509d837c13f:string:Demo Issuer",
        documentStore:
          "08948d61-9392-459f-b476-e3c51961f04b:string:0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
        identityProof: {
          type: "61c13b84-181a-43aa-85f5-dfe89e4b6963:string:DNS-TXT",
          location:
            "d7ba5e33-cf5f-4fcc-a4b7-3e6e17324966:string:demo-tradetrust.openattestation.com",
        },
        revocation: {
          type: "23d47c6b-4384-4c31-90ca-8284602f6b3e:string:NONE",
        },
      },
    ],
    links: {
      self: {
        href: "121c55c0-864d-4e54-a1f0-86bec4b9a050:string:https://action.openattestation.com?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftradetrust-functions.netlify.app%2F.netlify%2Ffunctions%2Fstorage%2Faea9cb1a-816a-4fd7-b3a9-84924dc9a9e9%22%2C%22key%22%3A%22d80b453e53bb26d3b36efe65f18f0482f52d97cffad6f6c9c195d10e165b9a83%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fdev.tradetrust.io%2F%22%2C%22chainId%22%3A%225%22%7D%7D",
      },
    },
    network: {
      chain: "05eb1707-5426-41d8-8fde-bc48ff0f2182:string:ETH",
      chainId: "ae505425-2df7-4597-87d2-037418d7bcbf:string:5",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash:
      "f292056ed5e5535400cec63b78a84ec384d2d77117e1606a17644e7b97a03cac",
    proof: [],
    merkleRoot:
      "f292056ed5e5535400cec63b78a84ec384d2d77117e1606a17644e7b97a03cac",
  },
};

const sample = {
  billFrom: {},
  billTo: { company: {} },
  $template: {
    type: "EMBEDDED_RENDERER",
    name: "INVOICE",
    url: "https://generic-templates.tradetrust.io",
  },
  issuers: [
    {
      name: "Demo Issuer",
      documentStore: "0x49b2969bF0E4aa822023a9eA2293b24E4518C1DD",
      identityProof: {
        type: "DNS-TXT",
        location: "demo-tradetrust.openattestation.com",
      },
      revocation: { type: "NONE" },
    },
  ],
  links: {
    self: {
      href: "https://example.com",
    },
  },
  network: { chain: "ETH", chainId: "5" },
};

const suite = new benchmark.Suite();

suite.add("openattestation: wrapDocument", () => {
  wrapDocument_oa(sample);
});

suite.add("@govtechsg/open-attestation: wrapDocument", () => {
  wrapDocument(sample);
});

suite.add("openattestation: getData", () => {
  getData_oa(wd);
});

suite.add("@govtechsg/open-attestation: getData", () => {
  getData(wd);
});

suite.add("openattestation: obfuscateDocument", () => {
  obfuscateDocument_oa(wd, "links");
});

suite.add("@govtechsg/open-attestation: obfuscateDocument", () => {
  obfuscateDocument(wd, "links");
});

suite.add("openattestation: verify", () => {
  verify_oa(wd);
});

suite.add("@govtechsg/open-attestation: verifySignature", () => {
  verifySignature(wd);
});

suite.on("cycle", (e) => {
  console.log(String(e.target));
});

suite.run();
