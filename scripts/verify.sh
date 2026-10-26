#!/usr/bin/env bash
set -euo pipefail

required=(README.md AGENTS.md REVIEW.md docs/VISUAL_CRITIC.md docs/PRODUCT_IMAGERY.md docs/DESIGN_EXPLORATION.md docs/RELEASE_READINESS.md index.html styles.css v4-1.css product-v5.css v6.css v7.css script.js package.json scripts/quality_check.py scripts/visual_qa.mjs)
for file in "${required[@]}"; do
  [[ -f "$file" ]] || { echo "Missing required file: $file" >&2; exit 1; }
done

git diff --check
python3 scripts/quality_check.py
node --check script.js
node --check scripts/visual_qa.mjs

for css in styles.css v4-1.css product-v5.css v6.css v7.css; do
  python3 - "$css" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
if text.count("{") != text.count("}"):
    raise SystemExit(f"Unbalanced CSS braces: {path}")
print(f"CSS structure check passed: {path}")
PY
done

echo "Verification passed."
