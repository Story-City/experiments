# Story City experiments and polls

Throwaway web prototypes and team polls, served at https://story-city.github.io/experiments/.

Each experiment is a folder of static files with relative paths, served at `/experiments/<folder>/`. Add an entry for it to `experiments.json`; `index.html` renders the cards from that file.

Cards are text only (title, one-line description, author and date); there are no preview images.

Entry fields: `slug` (unique, used in `view.html?e=<slug>`), `path` (folder URL including any `?v=`), `title`, `what`, `author` (`brett`, `melissa`), `authorName`, `date` (`YYYY-MM`), `category` (optional: `"poll"` puts the card on the Polls tab; `index.html?tab=polls` opens that tab), `archived`, `notionPageId`, `jira`, and for a new experiment `draft: true` plus `reviewer` (the person who asked for it). Drafts show on the Drafts stage tab inside Experiments (`index.html?stage=drafts`), tagged "Draft · waiting for <reviewer>"; approving means deleting both fields, which moves the card to the Experiments stage tab, grouped by part of the app. Leave `notionPageId` null for a new experiment; the sync creates its Notion task.

A page that isn't phone-sized (like Approved UI's side panel + cards) can set `"frame": "wide"` to get a wider frame in the viewer.

**Timeline tab** (`index.html?tab=timeline`, code in `timeline.js`): company key dates. `timeline.json` holds dates gathered from Notion (deployments, marketing calendar, decision log, town halls) and PostHog (versions Notion doesn’t list). Dates people add are saved in the hub database under slug `timeline` (only on the live site). It holds key dates only, never KPI numbers: this site and its database are public.

Every entry has an `area`: the part of the app it belongs to. The Experiments tab groups cards by area, in the order a player meets them: `first` (First-time experience), `finding` (Finding a story), `reading` (Reading a story), `puzzles` (Puzzles & story tools), `map` (Map & walking), `gems` (Gems & rewards), `together` (Playing together), `outside` (Outside the app), `design` (Design system). No area, or an unknown one, lands in Other. Each card shows its area as a small line icon in its top-right corner (`AREA_ICONS` in `index.html`; a new area needs an icon there).

An experiment with more than one page can list them as `tabs`: `[{ "label": "Mockup", "path": "<slug>/" }, { "label": "Vote", "path": "<slug>/vote.html" }]`. The viewer shows them as tabs at the top of the main column (in the top bar on phones), and the tab follows the page when a link inside it opens another page.

Once a feature ships, add `live`: `{ "since": "YYYY-MM", "shots": ["<slug>/live/1.png", "<slug>/live/2.mp4"], "note": "Shipped: …" }`. The card then shows up to two little phone-shaped snippets of the real app (screenshots, or short muted looping clips as .mp4/.webm, portrait, under ~1 MB each) with a green "Live in the app" badge and the note. Put the files in the experiment's own `live/` folder. Use real app captures only, not the mockup.

The author colour comes from `--author-<key>` in `theme.css`; add a token and a matching CSS rule in `index.html` for a new author. Filter chips build themselves from the entries. Set `archived: true` once something newer replaces it.

Cards open `view.html`, which wraps the experiment in an iframe with comments (pins, screenshots, replies), the Notion status and the Notion task's comments. Direct experiment URLs still work. See `hub/PLAN.md` for the design and `hub/firebase-config.js` for the Firebase connection.

`image-remix/` and `chat-chapter/` were imported with `git subtree`, so their history is in this repo's log. Their old repos redirect here.

## Design-to-dev handoff

Experiments are the design handoff: no separate UX doc or Figma. The Notion task links to its experiment.

- **`stage`** in an entry: `review` (In review), `ready` (Ready for Dev), `built` (Built). It shows as a badge on the card and in the viewer. The Experiments tab has three stage tabs in flow order: **Drafts › Experiments › Ready for Dev**. `ready` entries sit on Ready for Dev (`index.html?stage=ready`); everything that isn't a draft or ready sits on Experiments. Older `?tab=` and `#area-` links still land on the right stage. An experiment is Ready for Dev only once its design is final **and** it has `notionPageId`; without one the badge reads "Needs Notion task" (in red) instead.
- **`spec`**: path to the experiment's spec file, e.g. `"explore-picker/spec.json"`. The viewer then shows a **Spec** tab beside **Questions for design** (the comments). `view.html?e=<slug>&panel=questions` opens the questions instead. Spec fields:
  - `final`: which version is final; `summary`: one short paragraph
  - `flows`: `[{ "title", "show": "<page to open with Show me>", "rows": [{ "when", "then", "event" }] }]`
  - `back`: `[{ "from", "then" }]`: what Back does on each screen
  - `events`: `[{ "name" (snake_case), "status": "new" | "existing", "when", "props" }]`
  - `edgeCases`, `notes`: lists of strings
  - `assets`: `[{ "label", "file", "note" }]`: real files devs download (never screenshots)
- **Copy spec** in the Spec tab copies it as Markdown for a ticket.
- Run `node hub/check-handoff.mjs` before pushing: it fails on an unknown stage, Ready for Dev without a Notion task or spec, a missing spec, page or asset file, or a non-snake_case event.
