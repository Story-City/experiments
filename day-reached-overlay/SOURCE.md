# Source (do not reinvent)

Pulled from StoryCity mono-repo `suite-city` on Daniel’s training hub branch:

- Branch: `feature/SC-3526-training-hub`
- Lottie: `mobile-rn/src/v2/assets/training_hub_day_reached.json`
- Banner: `TrainingHubStreakBanner.tsx` (arc + beads + Lottie only)
- Bead / arc: `TrainingHubStreakBead.tsx`, `TrainingHubStreakArc.tsx`
- Geometry: `TrainingHubStreakBannerStyles.ts` (`FIGMA_FRAME_*`, `FIGMA_BEADS`, `dayReachedLottieLayout`, `DAY_REACHED_LOTTIE_*`)
- Glow layers: `mobile-rn/src/v2/config/accentGlow.ts`
- Sound/haptics (app only, not in this web mock): `DayReachedCelebrationCue.tsx`

Removed for this overlay: Training Hub headline/subtitle and all hub chrome beyond the streak graphic.

Underlays (real device, not invented UI):

- `underlays/adventure.jpg` — staging Screenshot_20261112_083910 (adventure mode picker)
- `underlays/audio.jpg` — staging Screenshot_20261112_083915 (tap to play)
- `underlays/reader.jpg` — staging Screenshot_20261112_083922 (reader + Carry on)

Overlay is `position: absolute; inset: 0` over the screenshot — never changes underlay layout.

Timing: soft haze in → same Lottie frame timing as the app → bead reveal → prolonged shine → soft dissolve out.
