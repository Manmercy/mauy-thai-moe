# i18n (Thai → English)
Thai is the source language (`src/*.js`). English variants are generated, never hand-edited.

1. `npm i` (acorn, acorn-walk)
2. `node extract.js` — finds every Thai string/template chunk → `pos.json`, `segs.json`
3. Translations: `en/NN.json` (aligned to `chunks.json` → `segs_old.json`), plus overrides/new strings in `extra.json`
4. `node gen.js` — writes `src/en/*.js` + `src/i18n_dict.json` (save-file conversion) and lists any untranslated segment under `missing`
5. `../../build.sh`

New Thai text in the sources → run 2 and 4, add each `missing` string to `extra.json`, run 4 again.
