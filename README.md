# Story City experiments

Throwaway web prototypes, served at https://story-city.github.io/experiments/.

Each experiment is a folder of static files with relative paths, served at `/experiments/<folder>/`. Add a card for it to `index.html`.

Each card's `<li>` carries `data-author` (`brett`, `melissa`) and a `.by` span with the display name. The author colour comes from `--author-<key>` in `theme.css`; add a token and a matching CSS rule in `index.html` for a new author. Filter chips build themselves from the cards. Move a card to the `#archived` list, as a collapsed `<details>`, once something newer replaces it.

`image-remix/` and `chat-chapter/` were imported with `git subtree`, so their history is in this repo's log. Their old repos redirect here.
