#!/usr/bin/env bash
set -euo pipefail

required=(README.md AGENTS.md REVIEW.md index.html styles.css script.js scripts/quality_check.py)
for file in "${required[@]}"; do
  [[ -f "$file" ]] || { echo "Missing required file: $file" >&2; exit 1; }
done

git diff --check
python3 scripts/quality_check.py
node --check script.js

echo "Verification passed."
