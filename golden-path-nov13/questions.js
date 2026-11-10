// The six "Decide in the room" questions for Golden Path, Fri Nov 13.
// Words come from reports/week-nov-10/golden-path-nov13.md. Edit a line here to change it on the page.
// n = the question's number in the meeting doc (3 and 5 have no pictures, so they are skipped).
export const QS = [
  {
    n: 1, short: 'Sign-up', mins: 7,
    title: 'When, if ever, do we force sign-up?',
    pick: 'A',
    why: 'Plus a skippable “save your progress” ask right after a trial starts. Every forced step loses people before the paywall, and Apple has rejected a hard gate before.',
    unblocks: 'Victoria’s Forced sign-up decision task · Brett’s account build · Leo’s App Store check',
    opts: {
      A: { name: 'Never forced', cap: 'Skippable after Welcome, asked again at the gem. Guests can still start a trial.' },
      B: { name: 'Required once a trial starts', cap: '“Save your progress” can’t be skipped after the trial starts.' },
      C: { name: 'Hard gate', cap: 'An account before the first real story, no way round it.' },
    },
  },
  {
    n: 2, short: 'Asking again', mins: 7,
    title: 'After “Not now”, when do we ask again?',
    sub: 'Trial, sign-up and permissions',
    pick: 'A',
    why: 'One second chance at the right moment, without nagging. Add a “Subscribe” button that’s always there (Andrew’s i47).',
    unblocks: 'Victoria’s Cycle of re-asking task · Brett’s prompt logic',
    opts: {
      A: { name: 'Once more each, when it matters', cap: 'One second ask at the right moment. After that, only from buttons.' },
      B: { name: 'Once per session', cap: 'Asked again every visit, at most once a day.' },
      C: { name: 'Never automatically', cap: 'Only from buttons: Subscribe any time, and Settings.' },
    },
  },
  {
    n: 4, short: 'Start', mins: 10, star: true,
    title: 'What does Start ask in the first real story?',
    pick: 'A',
    why: 'With B and C inside Customize. One tap gets people into chapter 1. Either way, modes stay switchable any time (Oct 14, confirmed Nov 9), which settles reopened FRS #6.',
    unblocks: 'The route-selection task · the Nov 3 “route default” row · Brett’s Start screen · CLAUDE.md open question 6',
    opts: {
      A: { name: 'Smart default + Customize', cap: 'The closest, simplest route from your door. One tap to start.' },
      B: { name: 'Four-option pop-up', cap: 'Route, walking, treadmill or at home, with “remember my choice”.' },
      C: { name: 'Time first', cap: '“How long have you got?” first, then where to start.' },
    },
  },
  {
    n: 6, short: 'Browse map', mins: 7,
    title: 'Browse map in explore mode: what shows?',
    pick: 'A',
    why: 'It’s honest (auto-placed stories have no fixed places) and cheap. Auto-placement runs when you tap Start, not while you browse. It fixes the dead end Andrew found: new users can’t see what’s nearby.',
    unblocks: 'Andrew’s i42 and i63 · influencers’ route map (i110, i111) · FRS #10 · Brett (map scope)',
    opts: {
      A: { name: 'Fixed routes + “Plays near you”', cap: 'Fixed routes as start points. Auto-placed stories in a list.' },
      B: { name: 'Every story pinned', cap: 'Each story pinned, with a route made up near you.' },
      C: { name: 'No browse map', cap: 'A list. The route shows only on the story page.' },
    },
  },
  {
    n: 7, short: 'Treadmill map', mins: 5,
    title: 'Treadmill mode: what map do players see?',
    pick: 'B', also: 'C',
    why: 'B by default, C when a story has a fantasy map. It feels like travelling, and Victoria agreed on Nov 2.',
    unblocks: 'Victoria’s treadmill-mode video · indoor step mode (Brett)',
    opts: {
      A: { name: 'Your own neighbourhood', cap: 'The streets outside your door, as on a real walk.' },
      B: { name: 'The story’s home city', cap: 'Satellite style: walk Adelaide from your treadmill.' },
      C: { name: 'A fantasy map', cap: 'When a story has one, like Tales from the Incident.' },
    },
  },
  {
    n: 8, short: 'Sample name', mins: 3,
    title: 'What do we call the sample story?',
    pick: 'B',
    why: 'It says the story is short, and the team already calls it that.',
    unblocks: 'The skip-onboarding card copy (i168) · Welcome and portal copy · i169',
    opts: {
      A: { name: 'First story', cap: 'The button says “Start your first story”.', btn: 'Start your first story', done: 'You finished your first story!', skip: 'Skip your first story' },
      B: { name: 'Tiny story', cap: 'The button says “Try a tiny story”.', btn: 'Try a tiny story', done: 'You finished a tiny story!', skip: 'Skip the tiny story' },
      C: { name: 'Keep “sample”', cap: 'The button says “Try a sample”.', btn: 'Try a sample', done: 'You finished the sample!', skip: 'Skip the sample' },
    },
  },
];
