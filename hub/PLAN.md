# Experiments hub plan

Decided with Brett on 2026-10-01. The hub wraps the existing static experiments with comments, Notion status and Notion tasks. Nothing inside an experiment folder changes.

## Decisions

| ID | Decision |
|---|---|
| D1 | The hub lives in this repo under `hub/`, built on the same origin as the experiments. |
| D2 | Comments are custom-built, stored in Firestore. No SaaS. |
| D3 | Anyone can comment on any experiment, always. Guests give a name and get anonymous Firebase auth. |
| D4 | Notion owns task status. The hub mirrors it read-only. |
| D5 | Comments sync both ways between the hub and the experiment's Notion task. |
| D6 | A GitHub Action runs the sync on push, every 15 minutes, and on manual dispatch. Lag of 15 to 60 minutes is accepted. |
| D7 | A new experiment gets its Notion task automatically on the first sync after it lands on `main`. |
| D8 | The Firebase project is new, in the storycity.app Google org. |

## Notion target

- Tasks Database `e1c023b1-8463-4af5-9c41-ac0f74be1ab1`, reached with the Bookerton token (`OOO_BOT_NOTION_TOKEN` in `/home/brett/Documents/dev/StoryCity/.env`).
- Status options: Backlog, Ready to Start, Blocked, In progress, Ready for Review, In Revision, Pending Signature/Approval, Staging, Done.
- New task: `Task` = experiment title, `On Point` = author's Notion user, `Status` = In progress, body holds the viewer URL.
- Existing task: chat-chapter is `3e566b1071fa81fa8ee5eb18a5871cea`.

## Phases

### P1 Manifest
- `experiments.json`: one entry per card with `slug`, `path` (including any `?v=`), `title`, `what`, `author`, `date`, `archived`, `notionPageId`, `jira`.
- `index.html` renders cards and archived entries from the manifest, keeping the current look, author colours and filter chips. Each card adds a Notion status chip, an open-comment count, and Notion/JIRA links.
- Cards link to the viewer. The README explains the new way to add an experiment.

### P2 Viewer
- `view.html?e=<slug>` loads the experiment's `path` in an iframe.
- Desktop: phone-sized frame plus a side panel listing the experiment's comments, Notion status and Notion comments.
- Phone: the iframe fills the screen with one floating comment button that opens the panel as a bottom sheet.
- Comment mode: tap to drop a pin, type, send. Pins show only while the iframe URL matches the URL the comment was made on.
- Direct experiment URLs keep working without comments.

### P3 Comments
- Firestore collection `comments`: `slug`, `url` (iframe location relative to the repo root), `x` and `y` as fractions of the iframe viewport, `vw`, `vh`, `screenshot` (JPEG data URL, max 200 KB, captured from the same-origin iframe document), `text`, `parentId` for replies, `author {uid, name, guest}`, `sha`, `createdAt`, `status` (open or resolved), `resolvedBy`, `resolvedSha`, `notionCommentId`, `source` (hub or notion).
- Rules: any signed-in user, including anonymous, can create within size limits and edit their own text. Team emails listed in the rules can resolve and delete.
- Comments made against an older commit show a "made on an earlier version" tag.
- No App Check in v1. Add it if spam appears.

### P4 Sync Action
`.github/workflows/sync.yml` runs `hub/sync/sync.mjs`, then builds and deploys Pages:
1. Manifest entries with no `notionPageId` get a task created; the ids are committed back with the default `GITHUB_TOKEN`, which does not retrigger workflows.
2. Each task's status and comments are written to `hub/notion.json` in the build output only, never committed.
3. Firestore comments with no `notionCommentId` are posted to the task as "Name: text" plus a link to the pin, and the returned id is stored. On read-back, comments authored by Bookerton are skipped so nothing echoes.
4. `hub/version.json` records the last commit sha and date touching each experiment folder.
5. Pages deploys from the Actions artifact, with `.nojekyll`.

### P5 Claude CLI
`hub/cli.mjs list <slug>` prints open comments with screenshots saved to disk. `hub/cli.mjs resolve <id> <sha>` resolves one with the fixing commit.

### P6 Backfill
Link chat-chapter to its existing task. Search the Tasks Database for the other experiments before creating new tasks for them.

## Setup

| ID | Item | State |
|---|---|---|
| S1 | Bookerton reads the Tasks Database | Verified 2026-10-01 |
| S2 | Bookerton creates pages and comments there | Unverified. Test on one row first. |
| S3 | Firebase project in the storycity.app org: Firestore, anonymous and Google auth, `story-city.github.io` as an authorized domain | Not created. Needs Brett in the console. |
| S4 | GitHub Action access to Firestore | Unknown. The org likely blocks service-account keys; the fallback is Workload Identity Federation. |
| S5 | Pages source switched from legacy branch build to GitHub Actions | Needs repo admin. |
| S6 | Repo secrets: Notion token, Firebase access | After S3 and S4. |
| S7 | Notion user ids for each author (Brett, Melissa) | Fetch via the users API. |

## Build order
P1, then P2 and P3 against a Firebase project, then S2, then P4, P6 and P5. Test the hub headless with Playwright at Pixel 7 size and at desktop size before each push.
