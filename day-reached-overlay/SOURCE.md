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

Timing: soft haze in → same Lottie frame timing as the app → bead reveal → soft dissolve out (Genshin-style dismiss, not a hard cut).
