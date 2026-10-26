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
7. For product presentation, follow `docs/PRODUCT_IMAGERY.md`. Real product photography is the source of truth. When a real photo is weak, prefer a faithful crop/cleanup/enhancement or generated derivative based on that real item over generic concept artwork.
8. Free/stock photography may support mood, setting, texture, or editorial context only when its license permits the intended use. Never present unrelated stock clothing as a Deadstock Tokyo product.
9. For major visual/art-direction decisions, follow `docs/DESIGN_EXPLORATION.md` and prepare materially different A/B/C directions rather than silently choosing among multiple valid subjective options.

## Autonomous loop
For LOW-risk experiments:
1. inspect the current site and task;
2. define observable acceptance criteria;
3. inspect real product media and verified product data when product presentation is involved;
4. implement the smallest complete improvement;
5. run `bash scripts/verify.sh`;
6. inspect the diff and repair failures;
7. open/update a PR targeting `ai-lab`;
8. for visual-facing changes, require successful automated Visual QA and follow `docs/VISUAL_CRITIC.md` on the latest screenshot artifact;
9. merge to `ai-lab` only when checks pass and no material deterministic or visual-review issue remains.

## Product imagery policy
- Preserve visible product identity: color, graphics, silhouette, proportions, and confirmed details.
- Do not invent product materials, fit, features, construction, colorways, back graphics, tags, availability, or claims.
- Generated imagery may improve lighting, background, composition, isolation, or contextual styling only when it remains faithful to the actual product.
- Use real photography for truth/confidence and faithful enhanced imagery for desire/impact where helpful.
- Record source/license provenance for third-party stock imagery; do not use assets with unclear usage rights.
- If the source media is too unclear to keep the generated result faithful, escalate instead of guessing.

## Visual review policy
- Deterministic browser checks catch breakage; the AI Visual Critic catches aesthetic weaknesses.
- For rendered-output changes, inspect phone, iPad portrait, iPad landscape and desktop screenshots from the latest successful Visual QA artifact.
- Follow `docs/VISUAL_CRITIC.md` for scoring, severity, idempotency and merge rules.
- Automatically fix only high-confidence LOW-risk polish issues with one clearly better solution.
- If multiple valid design directions exist, do not silently choose. Prepare A/B/C options or request direction.

## Escalate before
- merging or changing `main`;
- changing GitHub Pages/public deployment;
- changing product facts or live-shop behavior;
- adding paid services, credentials, tracking, analytics, or external APIs;
- deleting important content/history;
- any change with material legal, privacy, billing, licensing, or irreversible impact.

## Definition of done
- requested experiment works;
- existing core behavior is preserved unless intentionally changed;
- `bash scripts/verify.sh` passes;
- product-facing work follows `docs/PRODUCT_IMAGERY.md`;
- material art-direction choices follow `docs/DESIGN_EXPLORATION.md`;
- visual-facing work passes Visual QA and the latest artifact has completed AI Visual Critic review;
- no broken local assets, secrets, unresolved BLOCKER/HIGH visual findings, unverified image licensing, or unrelated changes are present;
- PR summary states what changed and how it was verified.
