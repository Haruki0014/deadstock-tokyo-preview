#!/usr/bin/env bash
set -euo pipefail

required=(README.md AGENTS.md REVIEW.md index.html styles.css v4-1.css script.js scripts/quality_check.py)
for file in "${required[@]}"; do
  [[ -f "$file" ]] || { echo "Missing required file: $file" >&2; exit 1; }
done

git diff --check
python3 scripts/quality_check.py
node --check script.js

for css in styles.css v4-1.css; do
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
