# AI Visual Critic

## Purpose
Review the screenshots produced by the automated Visual QA for aesthetic quality, not only technical correctness.

The Visual Critic is a qualitative second gate. It must never replace deterministic checks; it runs after Visual QA succeeds.

## Inputs
For the latest PR head commit, inspect the latest successful Visual QA artifact containing:
- `phone-390x844.png`
- `ipad-portrait-820x1180.png`
- `ipad-landscape-1180x820.png`
- `desktop-1440x1000.png`
- `visual-qa-report.json`

Review the screenshots individually and as a responsive set.

## Scoring rubric
Score each area from 1 to 5 and support the score with visible evidence.

1. **Composition & balance** — focal points, left/right balance, dead space, alignment.
2. **Visual hierarchy** — whether headline, product, price, CTA and supporting copy have the intended priority.
3. **Spacing & rhythm** — accidental gaps, cramped areas, section cadence, repeated spacing consistency.
4. **Typography** — scale, line breaks, readability, contrast and typographic consistency.
5. **Brand consistency** — refined underground / streetwear editorial character, monochrome + signal-lime discipline, avoidance of generic or emoji-like UI.
6. **Product emphasis** — product visuals and names feel intentional, comparable and visually coherent.
7. **CTA clarity** — shop/product links are easy to locate without overpowering the editorial composition.
8. **Responsive consistency** — the concept survives phone, portrait tablet, landscape tablet and desktop without one layout feeling like an afterthought.
9. **Visual-system consistency** — imagery, borders, iconography, cards and motion feel like one system rather than unrelated components.
10. **Overall polish** — whether the page feels deliberate, finished and presentation-ready for an experiment.

## Decision levels
- **PASS**: no obvious visual defect; no category below 3; overall presentation is coherent.
- **PASS WITH NOTES**: usable and coherent, but there are LOW polish opportunities that do not justify blocking the PR.
- **REVISE**: one or more high-confidence visual problems materially weaken the composition, hierarchy, consistency or readability.

## Severity
- **BLOCKER**: clipped/hidden critical content, severe overlap, unreadable text, broken visual state.
- **HIGH**: obvious accidental imbalance, major inconsistent visual language, severe hierarchy failure across a key viewport.
- **MEDIUM**: meaningful aesthetic weakness where multiple good design solutions are possible.
- **LOW**: small spacing, sizing, alignment, icon or polish improvement with a clear safe fix.

## Autonomy rules
The AI may automatically repair a finding only when all are true:
- confidence is high;
- the change is LOW risk and reversible;
- there is one clearly better solution rather than several equally valid art directions;
- no official product fact or brand claim is changed;
- the change stays inside `ai-lab` workflow.

After an automatic repair, rerun Visual QA and review the new screenshots again.

Do **not** silently choose when the finding is fundamentally about art direction, brand direction, campaign tone or a choice between several valid compositions. In those cases:
1. keep the current implementation intact;
2. create A/B/C candidate directions or a design-review issue;
3. explain the tradeoffs;
4. ask the user to select a direction before merging a major redesign.

## Merge gate
For PRs targeting `ai-lab` that change visual-facing files such as HTML, CSS, JavaScript affecting presentation, or visual assets:
1. deterministic `verify` must pass;
2. `visual-qa` must pass;
3. the latest Visual QA artifact must be reviewed by the Visual Critic;
4. there must be no unresolved BLOCKER/HIGH visual finding;
5. only then may a LOW-risk PR be auto-merged to `ai-lab`.

Pure documentation or CI-only PRs may skip the screenshot critique when they cannot change rendered output.

## Idempotency
After reviewing an artifact, add a PR conversation comment ending with:

`<!-- visual-critic artifact:<ARTIFACT_ID> head:<HEAD_SHA> -->`

Before reviewing, search the PR discussion for that exact artifact/head pair. If it already exists, do not repeat the review.

## Review output format
Use this compact structure:

### AI Visual Critic
**Decision:** PASS / PASS WITH NOTES / REVISE
**Artifact:** `<artifact id>`

| Area | Score | Evidence |
|---|---:|---|
| Composition & balance | 1–5 | ... |
| Visual hierarchy | 1–5 | ... |
| Spacing & rhythm | 1–5 | ... |
| Typography | 1–5 | ... |
| Brand consistency | 1–5 | ... |
| Product emphasis | 1–5 | ... |
| CTA clarity | 1–5 | ... |
| Responsive consistency | 1–5 | ... |
| Visual-system consistency | 1–5 | ... |
| Overall polish | 1–5 | ... |

**Top findings**
- `[severity]` finding + viewport + visible reason

**Action**
- `none`, `auto-fix`, or `A/B/C design decision required`

End with the idempotency marker.
