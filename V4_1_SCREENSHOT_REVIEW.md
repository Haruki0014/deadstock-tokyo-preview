# V4.1 Screenshot Review

## Source
Real iPad landscape screenshots of the V4 `ai-lab` preview.

## What works
- The hero has a strong first impression and clear brand hierarchy.
- Signal lime is being used as an accent rather than taking over the whole interface.
- Header navigation and EN/JP controls remain readable on iPad landscape.
- The editorial direction feels more intentional than V3.

## Findings to repair

### 1. Excessive vertical dead space before Point of View
On the iPad landscape screenshot, the gap between the lime ticker and the `01 / POINT OF VIEW` content is too large.

Root cause in V4 CSS:
- `.section-shell` can add up to 150px vertical padding.
- `.statement-layout` can then add up to another 90px top padding.
- On a wide iPad landscape viewport the desktop layout remains active, so the combined spacing becomes visually excessive.

Target:
- keep editorial breathing room;
- reduce combined top spacing on tablet/medium-wide viewports;
- preserve the more spacious desktop composition on genuinely large screens.

### 2. Ticker loop is not mathematically seamless
The ticker contains four unique phrases but duplicates only the first two phrases, while the animation translates by `-50%`.

Target:
- use two identical complete phrase groups or another deterministic seamless-loop structure;
- avoid visible jumps at the loop boundary;
- keep `prefers-reduced-motion` behavior.

Note: seeing a phrase partly clipped at a viewport edge while it is moving is normal; the problem to prevent is a discontinuous jump when the animation loops.

### 3. Hero orbit feels detached on iPad landscape
The circular D$T orbit is visually attractive but sits far from the core headline at this viewport size and reads like a separate decorative object.

Target:
- tighten its relationship to the headline on medium-wide/tablet landscape viewports;
- reduce scale/opacity or reposition it rather than removing it;
- avoid collision with headline and intro content.

### 4. Add a tablet-landscape layout tier
Current breakpoint switches primarily at 980px. The screenshot demonstrates that an iPad in landscape can be wide enough to receive the full desktop composition while still needing tighter spacing.

Target:
- add a medium-wide/tablet-landscape responsive tier (approximately 981–1500px, adjusted based on actual behavior);
- tune hero typography, orbit position, section spacing, and statement gap within that tier.

## Acceptance criteria
- Point of View content begins materially sooner after the ticker on iPad landscape while retaining intentional breathing room.
- Ticker loops continuously without a jump at its reset point.
- Hero orbit feels connected to the hero composition on tablet landscape.
- Desktop and phone layouts do not regress.
- `prefers-reduced-motion` remains respected.
- `bash scripts/verify.sh` passes.
- `main` is untouched; changes remain on the autonomous `ai-lab` experiment line.
