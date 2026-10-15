#!/usr/bin/env bash
set -euo pipefail
sdk_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
exec node "$sdk_dir/verification/run-live.mjs"
