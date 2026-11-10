# Source (do not reinvent)

Pulled from StoryCity mono-repo `suite-city` on Daniel’s training hub branch:

- Branch: `feature/SC-3526-training-hub`
- Lottie: `mobile-rn/src/v2/assets/training_hub_day_reached.json`
- Play wiring in app: `mobile-rn/src/v2/components/RetentionLoop/TrainingHubStreakBanner/TrainingHubStreakBanner.tsx`
- Timing / layout constants: `TrainingHubStreakBannerStyles.ts` (`DAY_REACHED_LOTTIE_*`)
- Sound/haptics cue (app only): `DayReachedCelebrationCue.tsx`

This experiment only rehosts that Lottie as a top-of-screen overlay with a soft haze, so it can sit over any UI (e.g. end of story) without the Training Hub chrome.
