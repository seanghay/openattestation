## OpenAttestation 

[![Testing](https://github.com/seanghay/openattestation/actions/workflows/tests.yml/badge.svg)](https://github.com/seanghay/openattestation/actions/workflows/tests.yml)

Extremely lightweight [OpenAttestation](https://github.com/Open-Attestation/open-attestation), works with Node.js and Browser.

```shell
npm install openattestation
```


### Benchmark

```
openattestation: wrapDocument x 20,868 ops/sec ±0.20% (100 runs sampled)
@govtechsg/open-attestation: wrapDocument x 16,939 ops/sec ±0.24% (101 runs sampled)

openattestation: getData x 388,367 ops/sec ±0.12% (99 runs sampled)
@govtechsg/open-attestation: getData x 233,006 ops/sec ±0.23% (100 runs sampled)

openattestation: obfuscateDocument x 92,576 ops/sec ±0.14% (100 runs sampled)
@govtechsg/open-attestation: obfuscateDocument x 82,101 ops/sec ±0.18% (97 runs sampled)

openattestation: verify x 20,528 ops/sec ±0.16% (100 runs sampled)
@govtechsg/open-attestation: verifySignature x 17,366 ops/sec ±0.19% (99 runs sampled)
```

### Credits

Most of the work here are copied from [Open-Attestation/open-attestation](https://github.com/Open-Attestation/open-attestation) official repo.
