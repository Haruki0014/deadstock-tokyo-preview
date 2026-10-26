# Release readiness — D$T/***TOKYO

This checklist defines the gate from the `ai-lab` prototype to a publishable storefront. It does not authorize deployment or a change to `main` by itself.

## Current architecture

- The branded editorial storefront is a discovery layer.
- Every purchase CTA must open the verified BASE listing for that exact product.
- BASE remains the transaction/source-of-truth layer for price, availability, variants, shipping, returns, payment and checkout.
- No local cart, fake checkout, invented inventory, reviews, scarcity, shipping promise, material, fit, sizing or product claim.

## Automated release gate

Before release candidate approval:

- `bash scripts/verify.sh` passes.
- Visual QA passes at phone 390×844, iPad portrait 820×1180, iPad landscape 1180×820 and desktop 1440×1000.
- No horizontal overflow, broken local images, page errors, console errors or header collisions.
- All three product CTAs resolve to their verified BASE destinations.
- Product names and displayed prices match the verified source-of-truth snapshot used for the release.
- AI-assisted imagery is explicitly disclosed anywhere it could be mistaken for product photography.
- Keyboard navigation, visible focus, skip link, meaningful alt text and reduced-motion behavior remain usable.
- Page title and description accurately describe the site and do not imply that the concept imagery is official product photography.

## Human/source-of-truth gate

These items cannot be invented by automation and must be confirmed from the brand/BASE before calling the storefront production-ready:

- Current official product photography or explicit approval to publish the AI-assisted editorial derivatives.
- Current product descriptions/specifications, including any material, sizing, fit and care information the brand wants surfaced.
- Current shipping, returns/cancellation and contact information. Keep these on BASE unless the exact current wording is verified.
- Brand approval for the public-facing copy and visual direction.
- Confirmation that all third-party imagery/fonts/assets are licensed for the intended public use.

## Publication gate

Publication is a high-impact action. It requires explicit approval for the release candidate and destination before changing `main`, GitHub Pages, DNS/custom domains, BASE theme/settings or any other public endpoint.

When approval is given:

1. Freeze a release candidate commit from `ai-lab`.
2. Re-run verify + visual QA against that exact SHA.
3. Review all four screenshots and external product links.
4. Merge the approved release candidate to `main` only after the checks are green.
5. Enable/configure the chosen public host only after confirming its resulting URL and privacy/publication implications.
6. Smoke-test the public URL on mobile and desktop and confirm every purchase CTA reaches the correct BASE listing.

## Release blockers

Do not publish when any of the following is unresolved: broken purchase link; mismatched product/price; unapproved or misleading product imagery; missing rights/provenance; checkout implication that does not exist; failed QA; or an unverified product/shipping/returns claim.
