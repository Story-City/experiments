// Problems and fixes: every problem the three Phase 3 testers found (reports/everyday-app/test-a/b/c.md),
// what changed, and a "Show Me" that jumps to the fixed screen in the right state.
// status: fixed | partly | open | melissa (a product call, mocked as Team options).
import { S, O, reg, esc, ic, byId } from './core.js';
import { MORE } from './words.js';

export const THEMES = [
  ['layout', 'Layout and reading'],
  ['safety', 'Safety: dark, weather, stops'],
  ['place', 'Saving your place'],
  ['picks', 'Picks and recommendations'],
  ['where', 'Rural, visiting and far away'],
  ['steps', 'Steps, treadmill, story only'],
  ['money', 'Trial, account and prices'],
  ['people', 'Families, teens and friends'],
  ['creator', 'Creators'],
  ['settings', 'Reminders and settings'],
  ['copy', 'Copy and decisions'],
];

// show: [journey, screen, params, extra]  extra: { sheet, sp, flow: {id, ch, way, mode, length}, opt: {..} }
export const PROBLEMS = [
  // ---------------- layout
  ['B1', 'blocker', 'layout', 'Hannah, Ruth, Amara', 'Library filter and mood chips rendered 2 px tall: invisible.', 'Rows no longer shrink; filters and moods are one row of 44 px chips.', 'fixed', ['hannah', 'library']],
  ['C1', 'blocker', 'layout', 'Glen, Chinedu', 'Same collapse hid At Home and Near Me at every text size.', 'Every row in a screen keeps its height (flex-shrink fix).', 'fixed', ['glen', 'library']],
  ['C2', 'blocker', 'layout', 'Mo, everyone', 'The cover with the typed cold open collapsed to 0 px on every overview.', 'The cover keeps its 170 px; the cold open types in again.', 'fixed', ['mo', 'overview', { id: 'summons' }]],
  ['C3', 'major', 'layout', 'Mo, Glen', 'A chart style broke 20+ top bars: titles invisible, back button centred, content squeezed.', 'Chart bars renamed; every top bar shows its title again (Balthazar title now whole).', 'fixed', ['mo', 'linked', {}, { tipsOff: true }]],
  ['B8', 'major', 'layout', 'All', 'Greeting collided with the weather line; the step pill covered the main button.', 'Greeting has its own line height; the step pill sits under the header, never over content.', 'fixed', ['ruth', 'today']],
  ['A23', 'polish', 'layout', 'All', 'Two-line greeting ran into the weather line.', 'Spacing fixed; guests are greeted without a name.', 'fixed', ['first', 'today']],
  ['A24', 'polish', 'layout', 'All', 'Floating step pill hid content and never moved.', 'Default: pill inline under the header. Team option keeps the floating 4.28.0 pill, which hides while scrolling.', 'fixed', ['priya', 'map']],
  ['C8', 'major', 'layout', 'Glen', 'Large text only zoomed the main screen; sheets, tabs and the pill stayed small; details were cut.', 'Large text now scales screens, sheets, tabs and toasts; card details wrap to two lines.', 'fixed', ['glen', 'today']],
  ['B21', 'minor', 'layout', 'Ruth, Glen', 'At Large text the Found It button was clipped and the step ring was a crescent.', 'The window card grows; the ring is a proper circle.', 'fixed', ['glen', 'sofa', {}, { flow: { id: 'squeaky', ch: 3, way: 'sofa' } }]],
  ['C18', 'minor', 'layout', 'Glen, all', 'Key details were 10–11 px caps; ghosted badges at 40% opacity.', 'Details at 11–12 px with less spacing; ghosted states are dashed, full-opacity text.', 'partly', ['glen', 'you']],
  ['C19', 'minor', 'layout', 'Glen', 'Chips, day chips, selects and gem pins under 44 px.', 'Chips, selects, links, day chips and gem pins are all at least 44 px.', 'fixed', ['glen', 'reminders']],
  ['C20', 'minor', 'layout', 'Screen-reader users', 'Walked days were colour only; day chips read “Day 1–7”; tips had no Next.', 'Days read “Monday, walked” and show a tick; chips named by day; tips have a Next button.', 'fixed', ['mo', 'linked']],
  ['C17', 'minor', 'layout', 'Mo', 'Postcard text was lilac on cream (about 2:1).', 'Postcard title in Night, message in Line purple; city and date added.', 'fixed', ['marcus', 'postcard', { id: 'squeaky' }]],
  ['B24', 'minor', 'layout', 'Hannah', 'Postcard had no Done, no city, and Save to Journal didn’t add it.', 'City and date on the card, a Done link, and the journal counts it.', 'fixed', ['hannah', 'postcard', { id: 'squeaky' }]],
  ['C26', 'polish', 'layout', 'All', 'Story pins looked like gems; legend pin matched nothing.', 'Story starts are one pearl pin with a story-colour dot.', 'fixed', ['hannah', 'map']],
  ['A22', 'minor', 'layout', 'All', 'Thursday lit up on Wednesday: a future day shown as walked.', 'Data fixed; future days are never lit and read “still to come”.', 'fixed', ['jordan', 'you', { sec: 'steps' }]],
  // ---------------- safety
  ['A2', 'major', 'safety', 'Wes, Tasha', 'Dark card: Lit Streets Only opened the sofa; Play at Home did nothing.', 'Each button does what it says: Lit Streets → Out the Door; Play at Home → From the Sofa; Not Now dismisses.', 'fixed', ['tasha', 'today']],
  ['C5', 'major', 'safety', 'Tasha, Glen, Chinedu', 'Snow, hot and storm buttons were dead or wired backwards.', 'Every weather button maps to a real action; only Not Now dismisses.', 'fixed', ['glen', 'today']],
  ['C6', 'major', 'safety', 'Chinedu, Tasha', 'At dusk the app pushed a 45-minute walk; Whimsy and Roulette started in the dark with no warning.', 'Start defaults indoors when light is short; dusk card offers a short loop or the sofa; Whimsy and Roulette ask first after dark and stick to walked, lit streets.', 'fixed', ['chinedu', 'today']],
  ['A5', 'major', 'safety', 'Wes', '“Stay on lit streets” on a gravel range road with no streetlights.', 'Rural dark card: wear something bright, take a light, walk facing traffic, or play at home.', 'fixed', ['wes', 'today']],
  ['C25', 'polish', 'safety', 'Glen', 'Snow card nudged an ice-avoider outdoors.', 'Snow card leads with “Icy out? The sofa version is ready.”', 'fixed', ['glen', 'today']],
  ['B12', 'minor', 'safety', 'Jordan, Ruth', '“It’s getting dark” at 6:30 am; “378 min of daylight left”.', 'Mornings say “Still dark · sunrise 7:45 am”; afternoons say “Sunset 4:48 pm · about 6 hours of light”.', 'fixed', ['jordan', 'today']],
  ['C11', 'major', 'safety', 'Glen', 'The doorstep mission was plain text: it couldn’t be started.', 'From Your Step opens a 60-second bird counter, from the sofa, the mission and Today.', 'fixed', ['glen', 'doorstep']],
  ['A17', 'minor', 'safety', 'Wes, Dana', '“Photograph something green” after dark; a window walk in the 7 am dark.', 'Missions swap by light and season: “Find a light that’s on” after dark, “something that isn’t white” in snow.', 'fixed', ['wes', 'mission']],
  // ---------------- saving your place
  ['A1', 'major', 'place', 'Priya, Marcus', 'Stop Here for Today didn’t save the story; toast hard-coded “Chapter 4”.', 'Stop saves story and chapter; Today shows it next time; toast names the real chapter.', 'fixed', ['priya', 'break', {}, { flow: { id: 'knight', ch: 2, way: 'door' }, progress: { knight: { ch: 2, of: 3 } } }]],
  ['B7', 'major', 'place', 'Hannah', 'Squeaky chapter 2 repeated chapter 1; “Next: the fire hydrant” after the hydrant; favour repeated.', 'Squeaky chapters 1–2 have their own beats; Next is the real next chapter; the favour shows once.', 'fixed', ['hannah', 'chapter', {}, { flow: { id: 'squeaky', ch: 2, way: 'door' } }]],
  ['C10', 'major', 'place', 'Glen', 'No way to finish at home mid-walk; “waits at the same spot”.', 'Finish at Home on the chapter map carries your steps into a window walk; Skip says your steps still count.', 'fixed', ['glen', 'walkmap', {}, { flow: { id: 'squeaky', ch: 3, way: 'door', mode: 'walk' } }]],
  ['A8', 'major', 'place', 'Marcus', 'Saving a gem at a chapter break dropped him on the Map tab, out of the story.', 'Save a Gem from a break returns to the break.', 'fixed', ['marcus', 'gemsave', { after: 'break' }, { flow: { id: 'squeaky', ch: 3, way: 'door' }, via: 'break' }]],
  ['C7', 'major', 'place', 'Tasha, Glen', 'Previously On… was hard-coded to Frightnight and stayed after she was back.', 'The recap uses the real last story and disappears after the first chapter back.', 'fixed', ['tasha', 'comeback']],
  // ---------------- picks
  ['A3', 'major', 'picks', 'Priya', 'What Fits sent a lunch walker to sit in a café; energy did nothing; chapter in progress never offered.', 'Medium and High energy never pick sit-down stories; only stories that fit the time; the chapter in progress comes first.', 'fixed', ['priya', 'today', {}, { sheet: 'fits', fits: { shown: true } }]],
  ['B18', 'minor', 'picks', 'Jordan', 'Brisk + 30 min returned two no-walking alternates.', 'High energy excludes sit-down stories.', 'fixed', ['jordan', 'today', {}, { sheet: 'fits', fits: { shown: true, energy: 'brisk', time: 30 } }]],
  ['C13', 'major', 'picks', 'Glen, Chinedu', 'Sit Down picked Barista (“walk to a café”) as “no walking needed”.', 'Café stories say “one short walk to a café, then you sit”; Barista left the No Walking shelf.', 'fixed', ['glen', 'today', {}, { sheet: 'fits', fits: { shown: true, energy: 'low', time: 30 } }]],
  ['B10', 'major', 'picks', 'New player, Hannah', 'After-FTUE picks offered Alice (needs a park) at 7:40 pm in the dark.', 'Picks work anywhere and after dark; the character’s line is built from the picks. Team option: Alice copy vs Play Anywhere.', 'melissa', ['first', 'recs', { from: 'summons' }]],
  ['B20', 'minor', 'picks', 'Ruth', 'Finished stories showed “1 of 3 endings” but no way to find the rest.', 'Overview shows found endings and silhouettes, plus Find Another Ending from your last choice.', 'fixed', ['ruth', 'overview', { id: 'summons' }]],
  ['B11', 'minor', 'picks', 'Hannah, Amara', 'Times were ambiguous: “50–80 min” vs “16 min”, minutes away by what, per episode?', '“About 50–80 min in all · 16 min of it walking”; “9 min drive”; “30–45 min an episode”.', 'fixed', ['amara', 'overview', { id: 'frightnight' }]],
  ['A13', 'minor', 'picks', 'Dana, Priya', 'At Home included park and café stories; duplicate chips; no treadmill filter; “indoor” found nothing.', 'One chip row; At Home means no venue; Treadmill filter; searches for indoor, treadmill, cold and farm work.', 'fixed', ['dana', 'library']],
  ['B16', 'minor', 'picks', 'Hannah', '“river valley” found nothing; results not by distance.', 'Place aliases and nearest-first sorting.', 'fixed', ['hannah', 'library', {}, { q: 'river valley' }]],
  ['A19', 'minor', 'picks', 'Priya', 'Loop-back only under Customize; Roulette “brings you home”.', 'Out the Door says it ends wherever you stop, with Loop Back Instead; Roulette brings you back to where you started.', 'fixed', ['priya', 'today', {}, { sheet: 'start', sp: { id: 'knight', fresh: true } }]],
  // ---------------- where
  ['A4', 'major', 'where', 'Wes', 'Rural setting stopped at the Map: café stories “near you”, park routes, urban stops, blocks.', 'Town stories flagged “Needs a town”, hidden from Near Me; rural stops and routes; feed finds and units fixed.', 'partly', ['wes', 'library', {}, { libFilter: 'near' }]],
  ['B15', 'minor', 'where', 'Hannah', 'A visitor’s map showed a home bubble and her “neighbourhood”.', 'Visiting mode: “Visiting Edmonton”, no home bubble, no fog.', 'fixed', ['hannah', 'map']],
  ['C23', 'minor', 'where', 'Chinedu', 'Edmonton street names, Lights Patrol and North American locals in Lagos.', 'Posts without street names; seasonal walk hidden; “Stories set in other cities” moved to the bottom.', 'fixed', ['chinedu', 'library']],
  ['B2', 'major', 'where', 'Hannah, Mo', 'Every story showed the same map; 5 dots for 17 stops; start never named.', 'Start point named (“Starts at the Chinese Garden gate”), dots match the stops, start inside the frame; Play Anywhere says it’s placed when you start.', 'partly', ['hannah', 'overview', { id: 'dragons' }]],
  ['A20', 'minor', 'where', 'Marcus, Wes', 'Home bubble copy read both ways; “min away” by what?', '“Your home stays hidden: we never draw the 200 m around it…”; “9 min drive” or “9 min walk”.', 'fixed', ['marcus', 'map']],
  ['B19', 'minor', 'where', 'Jordan', 'Walk There on the frontier opened a time picker, not the street.', 'Renamed Take Me Past It; Roulette steers you past that street.', 'partly', ['jordan', 'map']],
  // ---------------- steps
  ['A6', 'major', 'steps', 'Dana, Priya', 'Step counts disagreed on every screen; the Knight unlocked in 4 seconds on the pad.', 'One number per chapter everywhere; treadmill shows minutes at belt speed; sample stories say they’re 5 minutes.', 'fixed', ['dana', 'today', {}, { sheet: 'start', sp: { id: 'knight', fresh: true } }]],
  ['A15', 'minor', 'steps', 'Dana', 'Nothing said whether pad walks clear fog.', '“Pad steps don’t clear fog. They light up your next story stop instead.”', 'fixed', ['dana', 'treadmill', {}, { flow: { id: 'squeaky', ch: 3, way: 'tread' } }]],
  ['A21', 'minor', 'steps', 'Dana', 'Play Indoors ignored her pad and showed 663 steps on the sofa option.', 'Play Indoors uses the remembered indoor way; sofa says “no steps needed”.', 'fixed', ['dana', 'today']],
  ['B3', 'major', 'steps', 'Ruth', 'No way to hide step counts and goals.', 'Settings → Story only: hides the pill, goals and charts; walks show as minutes.', 'fixed', ['ruth', 'settings']],
  ['B17', 'minor', 'steps', 'Jordan', 'Today’s bar on the wrong day; no 10,000 goal; Health toggle unexplained; widget had no week.', 'Day fixed; goals 2,500–10,000; Health explains what it reads; widget shows the week.', 'fixed', ['jordan', 'you', { sec: 'steps' }]],
  ['C9', 'major', 'steps', 'Glen, wheelchair users', 'No step-free or bench info; wheelchair users told to take steps.', 'Access line on every overview, Step-Free filter and route, “Count pushes” setting.', 'partly', ['glen', 'overview', { id: 'kindness' }]],
  ['A12', 'minor', 'steps', 'Dana, Wes', 'Today’s Whimsy door had no Outside / At Home switch.', 'Switch on the Today door, with a pad version.', 'fixed', ['dana', 'today']],
  // ---------------- money
  ['A7', 'major', 'money', 'Wes', 'Checking the price reset Today to the first-day welcome.', 'The trial opened from your status returns where you were.', 'fixed', ['wes', 'you', {}, { sheet: 'status' }]],
  ['B4', 'major', 'money', 'Hannah, Amara', 'Hard-coded renewal dates, no price on status, “cancel in two taps”, reminder never asked.', 'Dates computed from the trial; price on status, timeline and button; honest cancel line; notifications asked after Start Free Trial.', 'fixed', ['amara', 'you', {}, { sheet: 'status' }]],
  ['B5', 'major', 'money', 'New player', 'Account re-ask after the sample, Start didn’t start, Library landed on Today, two identical paywalls.', 'Re-ask inside The Summons at the first gem; Start opens the story; Library lands on Library; the second paywall offers to keep one story.', 'fixed', ['first', 'recs']],
  ['A9', 'major', 'money', 'Marcus', 'Nothing said whether the kids pay.', 'Family line on status, trial and overviews. Pricing isn’t decided: Team option with three wordings.', 'melissa', ['marcus', 'you', {}, { sheet: 'status' }]],
  ['A18', 'minor', 'money', 'Wes', 'Free accounts saw “Included with your subscription”, twice.', '“Chapter 1 free · Members get the rest.”; members see “Included” once.', 'fixed', ['wes', 'overview', { id: 'incident' }]],
  ['B14', 'minor', 'money', 'Hannah', 'Guests saw account rows and were greeted “Sam”.', 'Guests get “Create a Free Account” and a greeting without a name.', 'fixed', ['hannah', 'settings']],
  ['C12', 'major', 'money', 'Chinedu', '“$34.99 · 67¢ a week” with no currency, outside Canada.', 'Canada shows CA$; elsewhere the store’s own currency, with a note.', 'fixed', ['chinedu', 'trial', { next: 'back' }]],
  // ---------------- people
  ['B6', 'major', 'people', 'Amara', 'A 15-year-old could share gems with Everyone, tagged “Hidden”; open join codes.', 'Under 16: Just Me or Friends only; shared gems drop Hidden and Secret vibes; codes expire and the host lets people in.', 'fixed', ['amara', 'gemsave']],
  ['B9', 'major', 'people', 'Amara', 'Start Together and Add a Friend did nothing.', 'Start Together opens a lobby with Let Them In; Add a Friend opens a code sheet.', 'fixed', ['amara', 'lobby', { id: 'frightnight' }]],
  ['B22', 'minor', 'people', 'Amara', 'Mission never said it was the same for everyone; no compare.', '“Same mission for everyone today”, and a friends compare line with no places.', 'fixed', ['amara', 'mission']],
  ['A14', 'minor', 'people', 'Marcus', 'Stay Within chips didn’t select; nothing said what the parent controls.', 'Chips select; “You still control Stop, Skip and who sees photos”; the map says “Spotter: look for…”.', 'partly', ['marcus', 'today', {}, { sheet: 'start', sp: { id: 'squeaky', fresh: true }, custom: true }]],
  ['A10', 'minor', 'people', 'Marcus', 'No word about faces in photos.', 'Camera: “Keep faces out”; Everyone: “We blur faces before anyone else sees it.”', 'fixed', ['marcus', 'camera', {}, { flow: { id: 'squeaky', ch: 4, way: 'door', mode: 'hunt' } }]],
  ['A11', 'minor', 'people', 'Priya', 'The mission saved a gem without asking (decided: explicit tap).', '“Keep it as a gem?” with Save Gem to My Map / No Thanks.', 'fixed', ['priya', 'mission']],
  // ---------------- creator
  ['C4', 'major', 'creator', 'Mo', 'Creator link: nothing playable, “More by” not tappable, no “make your own”.', 'More by Kevin opens a creator sheet; The Summons plays (with Play Together); Make Your Own Walk on the landing, You and recs. Balthazar itself can’t play until Nov 12.', 'partly', ['mo', 'linked', {}, { tipsOff: true }]],
  // ---------------- settings
  ['C14', 'minor', 'settings', 'Tasha, Glen', 'Four fixed times, no off switch, nothing persisted, Away was a toast.', 'All reminders switch, your own time, “1 a week”, choices stick, paused state shown with Resume Now.', 'fixed', ['tasha', 'reminders']],
  ['C15', 'minor', 'settings', 'Tasha, Chinedu', 'Personal lines named Squeaky for a Frightnight player; story steps above the week total.', 'Lines use the current story; story steps never exceed the week.', 'fixed', ['tasha', 'you']],
  ['A16', 'minor', 'settings', 'Wes', 'Low-data mode killed audio; Download was a toast.', 'Split: audio downloads on Wi-Fi, text only on the road; Download asks first and counts.', 'fixed', ['wes', 'settings']],
  ['B13', 'minor', 'settings', 'Hannah', '42 MB download on roaming with no warning.', 'Button shows the size; off Wi-Fi it asks Wait for Wi-Fi / Download Now.', 'fixed', ['hannah', 'overview', { id: 'coronet' }]],
  ['C21', 'minor', 'settings', 'Glen, Chinedu', 'Fog toggles out of sync; miles did nothing; gem patterns did nothing.', 'Fog toggles sync; miles works; unwired rows say “(mockup)”.', 'partly', ['chinedu', 'settings']],
  ['C22', 'minor', 'settings', 'Glen, Chinedu', 'Route Roulette had no At Home version.', 'Outside / At Home switch with ten turns round the house.', 'fixed', ['glen', 'roulette']],
  ['B23', 'minor', 'settings', 'All', 'Source notes showed with Reviewer mode off.', 'Moved into reviewer-only notes.', 'fixed', ['first', 'account', { mode: 'pre' }]],
  ['A25', 'polish', 'settings', 'All', '“Off by default — Melissa, Nov 2” in customer copy.', 'Customer copy says “Off by default.”; the source is a reviewer note.', 'fixed', ['dana', 'settings']],
  // ---------------- copy
  ['C24', 'minor', 'copy', 'All', 'Path was fully live though it’s “coming soon” until single-pin placement (Oct 13).', 'Path greyed “coming soon” by default (Local Originals and routes still use it); Team option to show it live.', 'fixed', ['mo', 'overview', { id: 'summons' }]],
  ['C16', 'minor', 'copy', 'Tasha, Mo', '“Nice walk.” after the sofa; “Chapter 3 · Chapter 3”; “An ending”.', '“Nice read.” on the sofa; chapter shown once; real ending names.', 'fixed', ['tasha', 'break', {}, { flow: { id: 'frightnight', ch: 3, way: 'sofa' } }]],
  ['A26', 'polish', 'copy', 'All', 'Widows and buttons over 3 words.', 'text-wrap on descriptions; See Lock Screen, Just Read, Describe It, Remind Me Later. Two decided labels kept (Save Gem to My Map, See the Whole Library).', 'partly', ['priya', 'reminders']],
  ['A27', 'polish', 'copy', 'Various', '“Clear out”, “your steps don’t”, “Pocket your phone” in Hunt, “Pick one” over one button.', 'Clear skies; steps still count; Hunt says find it then tap Take Photo; “Pick one” only with two choices.', 'fixed', ['marcus', 'walkmap', {}, { flow: { id: 'squeaky', ch: 4, way: 'door', mode: 'hunt' } }]],
  ['B25', 'polish', 'copy', 'All', 'Spacing, double punctuation, double welcome, “a school” stop, settings leaking across journeys.', 'Fixed spacing and stops; Settings choices no longer leak between journeys. The double welcome on victory is the shipped copy.', 'partly', ['hannah', 'overview', { id: 'frightnight' }]],
];

export const counts = () => {
  const c = { fixed: 0, partly: 0, open: 0, melissa: 0 };
  PROBLEMS.forEach((p) => { c[p[6]]++; });
  return c;
};

let filter = 'all';
export const probUI = { set filter(v) { filter = v; } };
reg('problems', {
  jewel: () => '#C49BFF',
  html() {
    const P = MORE.problems;
    const c = counts();
    const list = PROBLEMS.map((p, i) => [p, i]).filter(([p]) => filter === 'all' || p[1] === filter || p[6] === filter);
    const card = ([p, i]) => `<article class="prob" id="prob-${p[0]}">
      <div class="prob-top"><span class="pid">${esc(p[0])}</span><span class="sev ${p[1]}">${esc(P.sev[p[1]])}</span><span class="pst ${p[6]}">${esc(P.statuses[p[6]])}</span></div>
      <p class="prob-who">${esc(p[3])}</p>
      <p class="prob-what">${esc(p[4])}</p>
      <p class="prob-fix">${esc(p[5])}</p>
      <button class="btn ghost small" data-act="showMe" data-i="${i}">${ic('chev')} ${esc(P.showMe)}</button>
    </article>`;
    return `<div class="bar"><button class="back" data-act="probClose" aria-label="Close">${ic('x')}</button><span class="walk-name">${esc(P.open)}</span></div>
      <h1 class="display">${esc(P.title)}</h1><p class="sub">${esc(P.sub)}</p>
      <div class="prob-sum"><div class="f"><b>${c.fixed}</b><span>${esc(P.statuses.fixed)}</span></div><div class="p"><b>${c.partly}</b><span>${esc(P.statuses.partly)}</span></div><div class="o"><b>${c.melissa + c.open}</b><span>${esc(P.statuses.melissa)}</span></div></div>
      <div class="chips scrollx">${[['all', P.all], ['blocker', P.sev.blocker], ['major', P.sev.major], ['minor', P.sev.minor], ['polish', P.sev.polish], ['partly', P.statuses.partly], ['melissa', P.statuses.melissa]].map(([v, l]) => `<button class="chip" aria-pressed="${filter === v}" data-act="probFilter" data-v="${v}">${esc(l)}</button>`).join('')}</div>
      ${THEMES.map(([t, name]) => { const items = list.filter(([p]) => p[2] === t); return items.length ? `<section><div class="prob-theme"><p class="kicker section">${esc(name)}</p><small>${items.length}</small></div>${items.map(card).join('')}</section>` : ''; }).join('')}
      <p class="hint centre mt">Full list with reasons: reports/everyday-app/06-problems.md</p>`;
  },
});
