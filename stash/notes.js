// The Notes view. Plain HTML so line edits stay one-line changes.
export const NOTES = `
<section>
  <h2>The idea</h2>
  <p>Library becomes the shelf of stories you can walk. Everything that is yours moves into one place, drawn as a treasure chest: gems, your stories, badges, steps, friends, history and settings.</p>
  <p>The chest can show what's inside. It glows when there are finds to sort or a new badge, and it fills with gems as you keep them (Brett's "gem cavern" idea, Sep 17, without streak squares).</p>
</section>

<section>
  <h2>Names to choose from</h2>
  <ol class="lettered">
    <li><b>Stash</b>: short and playful, sounds like "mine". The tab label in this mockup.</li>
    <li><b>Hideout</b>: ties to The Summons ("You found one of our hideouts!"). Feels like a place you go back to.</li>
    <li><b>Treasure Chest</b> (or just <b>Chest</b>): matches the icon exactly. Chest alone is a bit plain.</li>
    <li><b>Satchel</b>: a walker's bag. Fits Steps, Path and Hunt.</li>
    <li><b>Trove</b>: means a store of treasure. Less common for younger players.</li>
    <li><b>Keepsakes</b>: warm, fits gems and endings. Weak for settings.</li>
    <li><b>You</b>: the tab name decided Nov 5. Picking any other name reopens that decision.</li>
  </ol>
  <p class="muted">Ruled out: <b>Loot</b> (sounds like loot boxes), <b>Cache</b> (Geocaching's word), <b>Curiosities</b> (already a gem type), <b>Vault</b> (sounds locked or paid), <b>Pack</b> (sounds like a bundle you buy).</p>
</section>

<section>
  <h2>What's there today, and where it would go</h2>
  <div class="tbl">
  <table>
    <thead><tr><th>Function</th><th>Real app today</th><th>In the Stash</th></tr></thead>
    <tbody>
      <tr><td>Stories in progress</td><td>Library tab, "In Progress"</td><td>My Stories</td></tr>
      <tr><td>Stories you bought</td><td>Library tab, "My Library"</td><td>My Stories</td></tr>
      <tr><td>Stories you wrote</td><td>Library tab, "Creator Adventures"</td><td>My Stories, a Made by Me shelf</td></tr>
      <tr><td>Finished stories and endings</td><td>Nowhere</td><td>My Stories → Finished</td></tr>
      <tr><td>Wish List</td><td>Nowhere</td><td>My Stories</td></tr>
      <tr><td>Badges</td><td>Only at the end of a story</td><td>Badges & Stamps (Oct 2 snag)</td></tr>
      <tr><td>Passport stamps</td><td>Nowhere</td><td>Badges & Stamps</td></tr>
      <tr><td>Gems</td><td>Only in the first-time story</td><td>Gems (A) or the Gem Hub (B)</td></tr>
      <tr><td>Steps, goal, week</td><td>The step pill's drawer (it has a streak and a leaderboard)</td><td>Steps, with no streak or leaderboard</td></tr>
      <tr><td>Friends</td><td>Nowhere (leaderboard only)</td><td>Friends: code, requests, cheers</td></tr>
      <tr><td>History</td><td>Nowhere</td><td>Walk Journal</td></tr>
      <tr><td>Avatar, name, username</td><td>Profile drawer header</td><td>Stash header</td></tr>
      <tr><td>Membership and restore</td><td>Settings</td><td>Status chip + Settings</td></tr>
      <tr><td>Account, password, delete</td><td>Settings → Account Settings</td><td>Settings</td></tr>
      <tr><td>Step goal, units, language, audio</td><td>Settings</td><td>Settings</td></tr>
      <tr><td>Coupons</td><td>Profile drawer (behind a flag)</td><td>My Coupons row</td></tr>
      <tr><td>Help</td><td>Profile drawer</td><td>Help & Feedback row</td></tr>
      <tr><td>Notifications</td><td>No setting (admin only)</td><td>Reminders row + Settings</td></tr>
      <tr><td>Privacy policy and terms</td><td>Sign-up screens only</td><td>Settings</td></tr>
      <tr><td>Feature requests</td><td>Built, not used</td><td>Help & Feedback</td></tr>
    </tbody>
  </table>
  </div>
  <p class="muted">Today the profile is a slide-out drawer from the avatar on Home, Feed and Map, not from Library. Source: <code>ProfileDrawer.tsx</code> and <code>Library.tsx</code> in mobile-rn.</p>
</section>

<section>
  <h2>Wanted next (from notes and testers)</h2>
  <ul>
    <li>Real steps live here, not on the map (Brett, Oct 15). Story steps and everyday steps shown apart.</li>
    <li>Badges visible any time (Leo and Emily, Oct 2). Friends badges at 1, 5 and 10 (team, Oct 29).</li>
    <li>A visible subscribed state, and a way to subscribe any time (Andrew, Sep 25).</li>
    <li>"Remember my choice" can be undone in Settings (dev, Oct 30).</li>
    <li>A history you build during the trial so leaving feels like a loss (team, Oct 29).</li>
    <li>Testers asked for a Watch-matched step count, a friends-only gem map, and "Can I publish a story?" (Nov 5).</li>
    <li>No streaks, missed-day counts or leaderboard (Melissa, Sep 17).</li>
  </ul>
</section>

<section>
  <h2>Gems: combined or separate?</h2>
  <p>Victoria's <a href="https://story-city.github.io/experiments/view.html?e=location-gems" target="_blank" rel="noopener">Location Gems hub</a> is a gem-only screen: take a snapshot, sort each find (keep hidden, publish, delete), then Public, Hidden and Liked, plus nearby public gems.</p>
  <h3>A · Combined</h3>
  <ul>
    <li>+ One place for "everything I own". A chest full of gems is the picture itself.</li>
    <li>+ Kept gems make the chest visibly fuller.</li>
    <li>− Sorting finds is a busy, swipe-heavy job inside a calm page.</li>
    <li>− Nearby public gems are about the world, not about you.</li>
  </ul>
  <h3>B · Separate</h3>
  <ul>
    <li>+ Gems stay a daily habit with their own front door (+ Gem).</li>
    <li>+ Victoria's hub ships as designed. The Stash stays simple.</li>
    <li>− "My gems" end up in two places, or players hunt for them.</li>
    <li>− + Gem does two jobs: take a photo and manage a collection.</li>
  </ul>
  <h3>C · Split by job (my lean)</h3>
  <p>+ Gem only captures. Your gems (sort, Public, Hidden, Liked) live in the Stash. Other people's gems nearby live on the Map. Each place does one job. Option A shows this, with Nearby kept in for comparison.</p>
</section>

<section>
  <h2>Questions for you</h2>
  <ol>
    <li>Name: A Stash, B Hideout, C Treasure Chest, D Satchel, E keep You?</li>
    <li>Gems: A combined, B separate, C split by job?</li>
    <li>Settings: A a gear at the top of the Stash, B a row at the bottom, C both?</li>
    <li>Does the chest fill up as you keep gems? A yes, B no, C later.</li>
  </ol>
</section>
`;
