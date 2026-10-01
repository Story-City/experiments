# Story City experiments

Throwaway web prototypes, served at https://story-city.github.io/experiments/.

Each experiment is a folder of static files with relative paths, served at `/experiments/<folder>/`. Add an entry for it to `experiments.json`; `index.html` renders the cards from that file.

Entry fields: `slug` (unique, used in `view.html?e=<slug>`), `path` (folder URL including any `?v=`), `title`, `what`, `author` (`brett`, `melissa`), `authorName`, `date` (`YYYY-MM`), `archived`, `notionPageId`, `jira`. Leave `notionPageId` null for a new experiment; the sync creates its Notion task.

The author colour comes from `--author-<key>` in `theme.css`; add a token and a matching CSS rule in `index.html` for a new author. Filter chips build themselves from the entries. Set `archived: true` once something newer replaces it.

Cards open `view.html`, which wraps the experiment in an iframe with comments (pins, screenshots, replies), the Notion status and the Notion task's comments. Direct experiment URLs still work. See `hub/PLAN.md` for the design and `hub/firebase-config.js` for the Firebase connection.

`image-remix/` and `chat-chapter/` were imported with `git subtree`, so their history is in this repo's log. Their old repos redirect here.
