// The Research view (Nov 26, 2026). Sources linked inline; UNVERIFIED = not confirmed in an official source.
const a = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

export const RESEARCH = `
<section>
  <h2>Three things to know first</h2>
  <ol>
    <li><b>Most apps use "Library" for your own things, not the catalogue.</b> Apple Books, Audible, Kindle and Spotify all do this, and so did YouTube's old Library tab. Players may look in Library for their stories in progress. Either test it, or call the catalogue something else (Stories, Explore, Discover).</li>
    <li><b>Big apps are merging "my stuff" into one tab.</b> YouTube merged Library and the account into a <b>You</b> tab (Oct 2023). Netflix added <b>My Netflix</b> (Jul 2023). Both framed it as everything of yours in one place.</li>
    <li><b>No app found uses a chest as its profile.</b> In walking apps a chest is a reward you tap to open (Joy Walk, CashWalker), so it reads like a loot box. Fine if nothing is paid or random. Riskier as the tab name.</li>
  </ol>
</section>

<section>
  <h2>How other apps do it</h2>
  <div class="tbl"><table>
    <thead><tr><th>App</th><th>Personal tab</th><th>Collections</th><th>Settings</th></tr></thead>
    <tbody>
      <tr><td>Pokémon GO</td><td>Trainer Profile (tap your portrait)</td><td>Separate: Bag, Pokédex. Medals in profile</td><td>Main menu</td></tr>
      <tr><td>Pikmin Bloom</td><td>Profile button, no tab bar</td><td>Separate: Decor, Postcards, Lifelog</td><td>Corner drawer</td></tr>
      <tr><td>Monster Hunter Now</td><td>Hunter menu / Guild Card</td><td>Separate Item Box. You pick medals to show</td><td>Not confirmed</td></tr>
      <tr><td>Ingress</td><td>Agent Profile</td><td>Separate inventory (2,000 cap)</td><td>Menu; can hide stats</td></tr>
      <tr><td>Finch</td><td>Pet profile (last tab)</td><td>Separate <b>Bag</b> tab</td><td>Gear</td></tr>
      <tr><td>Strava</td><td><b>You</b> tab</td><td>Inside: Trophy Case, latest 4 first</td><td>Gear, top-right</td></tr>
      <tr><td>AllTrails</td><td>Profile tab</td><td>Inside: completed, photos, lists, badges</td><td>Gear; privacy per type</td></tr>
      <tr><td>Komoot</td><td>Profile tab</td><td>Inside: tours, Collections (private by default)</td><td>In profile</td></tr>
      <tr><td>Duolingo</td><td>Profile tab</td><td>Inside: badges moved here in 2023 ("buried" before)</td><td>Gear, top-right</td></tr>
      <tr><td>Geocaching</td><td>Profile</td><td>Inside: Souvenirs (count + last 3)</td><td>Not confirmed</td></tr>
      <tr><td>YouTube</td><td><b>You</b> tab (avatar in the bar)</td><td>Inside: history, playlists, downloads</td><td>Inside You</td></tr>
      <tr><td>Netflix</td><td><b>My Netflix</b></td><td>Inside: downloads, My List, continue</td><td>Inside (not confirmed)</td></tr>
      <tr><td>Audible, Storytel</td><td>Profile</td><td>Library = your books. Stats, badges, goals in Profile</td><td>Profile</td></tr>
      <tr><td>Nike Run Club</td><td>Profile + separate <b>Activity</b> tab</td><td>Activity: history, trophies, bests</td><td>Profile</td></tr>
      <tr><td>Webtoon</td><td><b>MY</b> tab</td><td>Inside: history, subscriptions, downloads</td><td>A separate More tab</td></tr>
    </tbody>
  </table></div>
  <p class="muted">Sources: ${a('https://blog.youtube/news-and-events/youtube-new-features-2023/', 'YouTube')}, ${a('https://about.netflix.com/en/news/introducing-my-netflix-a-one-stop-shop-for-series-and-movies-you-want-to', 'Netflix')}, ${a('https://support.strava.com/hc/en-us/articles/216918557-The-Strava-Trophy-Case', 'Strava')}, ${a('https://blog.duolingo.com/achievement-badges', 'Duolingo')}, ${a('https://scopelyexplore.helpshift.com/hc/faq/1087-viewing-your-trainer-profile-progress/', 'Pokémon GO')}, ${a('https://www.pikminwiki.com/Pikmin_Bloom_interface', 'Pikmin Bloom')}, ${a('https://support.ingress.com/hc/en-us/articles/41140360065947-Agent-Profile', 'Ingress')}, ${a('https://www.geocaching.com/blog/?p=98016', 'Geocaching')}, ${a('https://www.komoot.com/help/privacy', 'Komoot')}, ${a('https://support.alltrails.com/hc/en-us/articles/4409908005396-How-to-manage-who-can-see-your-completed-trails', 'AllTrails')}, ${a('https://help.audible.com/s/article/view-your-listening-stats', 'Audible')}, ${a('https://www.nike.com/help/a/nrc-activity', 'Nike Run Club')}. Finch is from a third-party tour, lower confidence.</p>
</section>

<section>
  <h2>Patterns</h2>
  <ul>
    <li><b>Games keep the bag apart from the profile.</b> Every Niantic game has a Bag or Box you manage, plus a profile for level and medals.</li>
    <li><b>Fitness and outdoor apps keep collections inside the profile</b>, with a preview row (count + last 3 or 4) that opens the full list.</li>
    <li><b>Settings sit behind a gear, top-right of the profile</b> (Strava, AllTrails, Duolingo).</li>
    <li><b>Friends are a section of the profile</b>, not a tab (Pokémon GO, Strava, Monster Hunter Now).</li>
    <li><b>A daily diary is common</b>: Pokémon GO Journal, Pikmin Lifelog, Strava Activities. That's our Walk Journal.</li>
    <li><b>Privacy is set per kind of thing, often private by default</b> (Komoot collections, AllTrails).</li>
    <li><b>The personal tab goes last (far right), often as your avatar.</b></li>
  </ul>
  <p><b>For gems:</b> the patterns back C. Your gems sit in the personal tab as a preview that opens a full gallery (like Strava and Geocaching). If sorting and managing gems becomes a big daily job, the game pattern (a separate bag, B) gets stronger.</p>
</section>

<section>
  <h2>Naming the tab</h2>
  <ul>
    <li>Guidance from ${a('https://www.nngroup.com/articles/mobile-navigation-patterns/', 'Nielsen Norman Group')} and ${a('https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns', 'Android')}: 5 tabs at most, a short text label on every tab, one word that doesn't wrap.</li>
    <li>A person or avatar icon is one of the few icons people read without a label. No study tests a metaphor icon like a chest against it.</li>
    <li>Metaphor names cost clarity. One option keeps both: a plain label (<b>You</b>) with your avatar, and "Priya's Stash" as the heading inside.</li>
  </ul>
  <p>Options: <b>A</b> tab "Stash" with a chest icon · <b>B</b> tab "You" with your avatar, "Stash" inside · <b>C</b> tab "You", no Stash name.</p>
</section>

<section>
  <h2>Rules the profile has to meet</h2>
  <ul>
    <li><b>Delete Account inside the app</b> (Apple 5.1.1(v)). Warn members that billing continues until they cancel, and link to Manage Subscription. Revoke Sign in with Apple. ${a('https://developer.apple.com/support/offering-account-deletion-in-your-app/', 'Apple')}</li>
    <li><b>Google Play also needs a web page</b> to request deletion without the app (enforced from May 31, 2024). ${a('https://support.google.com/googleplay/android-developer/answer/13327111', 'Play Help')}</li>
    <li><b>Restore Purchases</b> (Apple 3.1.1). <b>Sign in with Apple</b> if we offer Google or Facebook sign-in (4.8). ${a('https://developer.apple.com/app-store/review/guidelines/', 'Apple guidelines')}</li>
    <li><b>Report and block</b> for public gems and friends, plus published contact details (Apple 1.2).</li>
    <li><b>Steps:</b> a privacy screen Health Connect can open, and ask only for the step data needed. Never use HealthKit data for ads (Apple 5.1.3). ${a('https://developer.android.com/health-and-fitness/health-connect/get-started', 'Health Connect')}</li>
    <li><b>Under 13:</b> COPPA's updated rule (compliance from Apr 22, 2026) needs separate parent consent and a written retention policy. ${a('https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule', 'Federal Register')}</li>
    <li><b>Privacy settings on screen</b> where they apply, not only in the policy (UK Children's Code). Privacy policy and terms should be in Settings; today they're only on sign-up.</li>
  </ul>
</section>

<section>
  <h2>Safety defaults to adopt</h2>
  <ul>
    <li><b>Gems hidden by default</b>; publishing is a choice, with no nudges toward it (${a('https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/', 'UK Children’s Code')}; ${a('https://www.priv.gc.ca/en/opc-news/news-and-announcements/2026/nr-c_261020/', 'Canada’s Children’s Privacy Code, Oct 2026')}).</li>
    <li><b>Friends by code only.</b> No people search, contacts matching or "people near you".</li>
    <li><b>No public gems at homes, schools, daycares</b> or places mainly for kids (${a('https://niantic.helpshift.com/hc/ja/21-wayfarer/faq/2770-eligibility-criteria/', 'Niantic')}; ${a('https://www.geocaching.com/play/guidelines', 'Geocaching')}). Our home bubble fits this.</li>
    <li><b>Strip photo location data</b> and show a gem at the place, not the exact spot. Never show a teen's routes publicly; hidden start points can be worked out from repeat walks.</li>
    <li>Australia's draft children's privacy code (target Dec 10, 2026) would need parent consent under 15. Not yet confirmed as registered.</li>
  </ul>
</section>

<section>
  <h2>Badges, streaks and the chest</h2>
  <ul>
    <li>Game points raise steps while they run, then fade (${a('https://pubmed.ncbi.nlm.nih.gov/31498375/', 'STEP UP trial, 2019')}). Plan for what keeps people going after a badge.</li>
    <li>Duolingo softened streaks (up to two streak freezes). Supports our "no streaks" line.</li>
    <li><b>The chest is only a loot box if it's paid and random.</b> Belgium treats paid loot boxes as gambling; Australia rates games with them M or higher. A chest of things you earned by walking is outside those rules.</li>
    <li>To keep it safe: no "open the chest" reveal that teases rarity, no paid keys, no random rewards tied to the membership.</li>
  </ul>
</section>

<section>
  <h2>Questions this adds</h2>
  <ol>
    <li>Catalogue name: A keep "Library", B Stories, C Explore, D test it with players.</li>
    <li>Tab label: A Stash + chest, B You + avatar with "Stash" inside, C You only.</li>
    <li>Gems: A combined, B separate, C split (research leans C: a preview in the Stash, the full gallery behind it).</li>
  </ol>
</section>
`;
