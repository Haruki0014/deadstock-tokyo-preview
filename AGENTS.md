# AGENTS.md

## Mission
Use this repository as a safe experimental sandbox for improving the Deadstock Tokyo concept site with minimal user intervention.

## Branch policy
- `main` is the stable public-preview baseline. Do not modify or merge into `main` automatically.
- `ai-lab` is the autonomous experiment integration branch.
- Non-trivial experiments should use short-lived branches targeting `ai-lab`.

## Product constraints
1. Preserve the monochrome / refined underground streetwear editorial direction unless an experiment explicitly tests another direction.
2. Do not invent official product facts, prices, availability, materials, sizing, campaign claims, or owner-approved brand statements.
3. Concept artwork must never be presented as actual product photography.
4. Existing BASE product links may be preserved, but do not create fake checkout, cart, payment, stock, or order behavior.
5. Keep owner-review/private-concept disclaimers until the owner explicitly approves public use.
6. Prefer mobile-first, accessible, fast, dependency-light HTML/CSS/JavaScript.

## Autonomous loop
For LOW-risk experiments:
1. inspect the current site and task;
2. define observable acceptance criteria;
3. implement the smallest complete improvement;
4. run `bash scripts/verify.sh`;
5. inspect the diff and repair failures;
6. open/update a PR targeting `ai-lab`;
7. merge to `ai-lab` only when checks pass and no material review issue remains.

## Escalate before
- merging or changing `main`;
- changing GitHub Pages/public deployment;
- changing product facts or live-shop behavior;
- adding paid services, credentials, tracking, analytics, or external APIs;
- deleting important content/history;
- any change with material legal, privacy, billing, or irreversible impact.

## Definition of done
- requested experiment works;
- existing core behavior is preserved unless intentionally changed;
- `bash scripts/verify.sh` passes;
- no broken local assets, secrets, or unrelated changes are present;
- PR summary states what changed and how it was verified.
