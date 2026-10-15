# Voxgig SDK generator — mini task 1

**Lucas Avilés Arias · 15 October 2026**

## Project and results

This TypeScript SDK covers authentication and product CRUD in my existing [MiniMarket Plus Spring Boot API](https://github.com/lcaviles1/MinimarketEFT/tree/6147d9c4db01d73624d522a492f9c679ae938984). A search for `minimarket` found no matching SDK in the Voxgig catalogue.

The project was scaffolded with create-sdkgen **0.30.7**, generated with sdkgen **4.34.7**, and verified using Node 24 and Java 17. Project metadata is configured in `project.aontu`.

- **Generated tests:** 209 passed, 9 skipped, 0 failed.
- **Live integration:** 9 checks passed against the local Spring Boot/H2 backend, covering login, product CRUD, HAL responses and access denial.
- **Doctor:** passed with no scaffold drift.

## Observations

1. **Regeneration:** keeping project settings in the model worked well. A scaffold prompt for author, repository and package scope would simplify initial setup.
2. **Documentation:** the public agent guide includes `.aon` filenames, while the installed scaffold uses `.aontu`. Updating those examples would make the first run clearer.
3. **HAL responses:** the collection is exposed through `Producto().load()` without an ID. Response data retains `_embedded` and `_links`, but the generated type uses `embedded` and `links`. This naming mismatch deserves investigation; a HAL example would also help.
4. **Error behaviour:** a valid read-only user received 401 when attempting a write. Raw HTTP reproduced this, identifying it as backend behaviour. A 403 would communicate insufficient permissions more clearly.

The SDK is MIT licensed. Generated runtime code and templates were left unchanged. Verification covers the selected endpoints in a local demo environment.

[Reproduction instructions](SUBMISSION.md) · [Generated tests](evidence/generated-test-results.json) · [Live checks](evidence/live-results.json) · [Doctor](evidence/doctor.txt)
